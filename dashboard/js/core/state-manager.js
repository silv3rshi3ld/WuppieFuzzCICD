/**
 * Enhanced state manager for handling UI state and data coordination
 * with support for progressive loading and error handling
 */
class StateManager {
    constructor(fuzzerName) {
        this.fuzzerName = fuzzerName;
        this.dataLoader = new DataLoader(fuzzerName);
        this.currentPage = 0;
        this.itemsPerPage = 25;
        this.searchQuery = '';
        this.filters = {
            hit: true,
            miss: true,
            unspecified: true,
            partial: true
        };
        this.selectedEndpoint = null;
        this.subscribers = new Map();
        this.componentData = {
            metadata: null,
            coverage: null,
            endpoints: [],
            bugs: []
        };
        this.loadingState = {
            components: new Set(),
            errors: new Map()
        };
    }

    /**
     * Load component data with error handling
     */
    async loadComponentData(component) {
        if (this.loadingState.components.has(component)) {
            return null; // Already loading
        }

        this.loadingState.components.add(component);
        this.notifySubscribers('loadingState', this.getLoadingState());

        try {
            let data;
            switch (component) {
                case 'metadata':
                    data = await this.dataLoader.loadMetadata();
                    break;
                case 'coverage':
                    data = await this.dataLoader.loadCoverage();
                    break;
                case 'endpoints':
                    data = await this.loadInitialEndpoints();
                    break;
                case 'bugs':
                    data = this.extractBugsFromEndpoints();
                    break;
                default:
                    throw new Error(`Unknown component: ${component}`);
            }

            this.componentData[component] = data;
            this.loadingState.errors.delete(component);
            this.notifySubscribers(component, data);
            return data;

        } catch (error) {
            this.loadingState.errors.set(component, error);
            throw error;

        } finally {
            this.loadingState.components.delete(component);
            this.notifySubscribers('loadingState', this.getLoadingState());
        }
    }

    /**
     * Load initial set of endpoints
     */
    async loadInitialEndpoints() {
        const endpoints = await this.dataLoader.loadEndpointChunk(0);
        if (!endpoints) {
            throw new Error('Failed to load initial endpoints');
        }
        return endpoints;
    }

    /**
     * Load next chunk of endpoints
     */
    async loadNextEndpointChunk() {
        const loadingState = this.dataLoader.getLoadingState();
        if (loadingState.loadingChunks.length > 0 || !loadingState.hasMore) {
            return false;
        }

        try {
            const newEndpoints = await this.dataLoader.loadEndpointChunk(loadingState.currentChunk);
            if (newEndpoints && newEndpoints.length > 0) {
                this.componentData.endpoints = [...this.componentData.endpoints, ...newEndpoints];
                this.notifySubscribers('endpoints', this.getFilteredEndpoints());
                return true;
            }
        } catch (error) {
            console.error('Error loading endpoint chunk:', error);
        }
        return false;
    }

    /**
     * Extract bugs from endpoints data
     */
    extractBugsFromEndpoints() {
        const bugs = [];
        for (const endpoint of this.componentData.endpoints) {
            const statusCodes = endpoint.status_codes || {};
            for (const [code, count] of Object.entries(statusCodes)) {
                if (parseInt(code) >= 500) {
                    bugs.push({
                        endpoint: endpoint.path,
                        method: endpoint.method,
                        status_code: code,
                        count: count,
                        response_data: endpoint.response_data
                    });
                }
            }
        }
        return bugs;
    }

    /**
     * Update specific component
     */
    async updateComponent(component) {
        await this.loadComponentData(component);
        this.updateUIElements();
    }

    /**
     * Get current loading state
     */
    getLoadingState() {
        return {
            loading: this.loadingState.components.size > 0,
            components: Array.from(this.loadingState.components),
            errors: Object.fromEntries(this.loadingState.errors),
            endpointState: this.dataLoader.getLoadingState()
        };
    }

    /**
     * Subscribe to state changes
     */
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);
    }

    /**
     * Unsubscribe from state changes
     */
    unsubscribe(key, callback) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key).delete(callback);
        }
    }

    /**
     * Notify subscribers of state changes
     */
    notifySubscribers(key, data) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in subscriber callback for ${key}:`, error);
                }
            });
        }
    }

    /**
     * Set search query and update filtered endpoints
     */
    setSearchQuery(query) {
        this.searchQuery = query;
        this.currentPage = 0;
        this.notifySubscribers('endpoints', this.getFilteredEndpoints());
    }

    /**
     * Set filter and update filtered endpoints
     */
    setFilter(type, enabled) {
        this.filters[type] = enabled;
        this.currentPage = 0;
        this.notifySubscribers('endpoints', this.getFilteredEndpoints());
    }

    /**
     * Select endpoint and notify subscribers
     */
    selectEndpoint(endpoint) {
        this.selectedEndpoint = endpoint;
        this.notifySubscribers('selectedEndpoint', endpoint);
    }

    /**
     * Get filtered and paginated endpoints
     */
    getFilteredEndpoints() {
        try {
            const filtered = this.componentData.endpoints.filter(endpoint => {
                // Apply type filter
                if (!this.filters[endpoint.type]) {
                    return false;
                }
                
                // Apply search filter
                if (this.searchQuery) {
                    const searchLower = this.searchQuery.toLowerCase();
                    return endpoint.path.toLowerCase().includes(searchLower) ||
                           endpoint.method.toLowerCase().includes(searchLower);
                }
                return true;
            });
            
            const start = this.currentPage * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            
            return {
                items: filtered.slice(start, end),
                total: filtered.length,
                page: this.currentPage,
                totalPages: Math.ceil(filtered.length / this.itemsPerPage),
                hasMore: this.dataLoader.hasMoreEndpoints()
            };
        } catch (error) {
            console.error('Error filtering endpoints:', error);
            return {
                items: [],
                total: 0,
                page: 0,
                totalPages: 0,
                hasMore: false
            };
        }
    }

    /**
     * Set current page
     */
    setPage(pageNum) {
        const totalPages = Math.ceil(this.componentData.endpoints.length / this.itemsPerPage);
        if (pageNum >= 0 && pageNum < totalPages) {
            this.currentPage = pageNum;
            this.notifySubscribers('endpoints', this.getFilteredEndpoints());
        }
    }

    /**
     * Get complete state
     */
    getState() {
        return {
            metadata: this.componentData.metadata,
            coverage: this.componentData.coverage,
            endpoints: this.getFilteredEndpoints(),
            bugs: this.componentData.bugs,
            selectedEndpoint: this.selectedEndpoint,
            filters: this.filters,
            searchQuery: this.searchQuery,
            loadingState: this.getLoadingState()
        };
    }

    /**
     * Update UI elements
     */
    updateUIElements() {
        try {
            const metadata = this.componentData.metadata;
            if (metadata) {
                // Update duration
                const durationElement = document.getElementById('duration');
                if (durationElement && metadata.fuzzer?.duration) {
                    durationElement.textContent = `Duration: ${metadata.fuzzer.duration}`;
                }
                
                // Update stats
                const stats = {
                    totalRequests: metadata.fuzzer?.total_requests || 0,
                    criticalErrors: metadata.fuzzer?.critical_issues || 0,
                    uniqueEndpoints: metadata.total_endpoints || 0,
                    successRate: metadata.summary?.success_rate || 0
                };
                
                Object.entries(stats).forEach(([id, value]) => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.textContent = id === 'successRate' ? `${value}%` : value;
                    }
                });
            }
        } catch (error) {
            console.error('Error updating UI elements:', error);
        }
    }
}

// Export for use in other modules
window.StateManager = StateManager;
