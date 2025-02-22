/**
 * State manager for handling UI state and data coordination
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
        this.metadata = null;
        this.coverage = null;
        this.endpoints = [];
    }

    initialize() {
        try {
            // Load data using the data loader
            this.metadata = this.dataLoader.loadMetadata();
            this.coverage = this.dataLoader.loadCoverage();
            this.endpoints = this.dataLoader.loadEndpointChunk(0);
            
            // Validate loaded data
            if (!this.validateData()) {
                console.error('Data validation failed. Some features may not work correctly.');
            }
            // Process endpoints for filtering
            this.endpoints = this.endpoints.map(endpoint => {
                const total = endpoint.total_requests || 0;
                const success = Object.entries(endpoint.status_codes || {})
                    .filter(([code]) => code.startsWith('2'))
                    .reduce((sum, [_, count]) => sum + count, 0);
                
                return {
                    ...endpoint,
                    type: total === 0 ? 'unspecified' :
                          success === total ? 'hit' :
                          success === 0 ? 'miss' :
                          'partial'
                };
            });
            
            // Initialize charts with actual data
            const chartData = {
                status_distribution: {
                    hits: this.endpoints.filter(e => e.type === 'hit').length,
                    misses: this.endpoints.filter(e => e.type === 'miss').length,
                    unspecified: this.endpoints.filter(e => e.type === 'unspecified').length,
                    partial: this.endpoints.filter(e => e.type === 'partial').length
                },
                method_coverage: this.endpoints.reduce((acc, e) => {
                    if (e.total_requests > 0) {
                        acc[e.method] = (acc[e.method] || 0) + e.total_requests;
                    }
                    return acc;
                }, {}),
                status_codes: Object.entries(
                    this.endpoints.reduce((acc, e) => {
                        Object.entries(e.status_codes || {}).forEach(([code, count]) => {
                            acc[code] = (acc[code] || 0) + count;
                        });
                        return acc;
                    }, {})
                ).map(([status, count]) => ({ status, count }))
            };
            
            // Update coverage data
            this.coverage = chartData;
            
            // Notify subscribers
            this.notifySubscribers('metadata', this.metadata);
            this.notifySubscribers('coverage', this.coverage);
            this.notifySubscribers('endpoints', this.getFilteredEndpoints());
            
            // Update UI elements
            this.updateUIElements();
            this.notifySubscribers('coverage', chartData);
            
        } catch (error) {
            console.error('Error initializing state:', error);
            throw error;
        }
    }

    validateData() {
        // Validate metadata
        if (!this.metadata || typeof this.metadata !== 'object') {
            console.error('Invalid metadata:', this.metadata);
            return false;
        }

        // Validate coverage
        if (!this.coverage || typeof this.coverage !== 'object') {
            console.error('Invalid coverage data:', this.coverage);
            return false;
        }

        // Validate endpoints
        if (!Array.isArray(this.endpoints)) {
            console.error('Invalid endpoints data:', this.endpoints);
            return false;
        }

        // Validate each endpoint
        const invalidEndpoints = this.endpoints.filter(endpoint => !this.dataLoader.validateEndpoint(endpoint));
        if (invalidEndpoints.length > 0) {
            console.error('Found invalid endpoints:', invalidEndpoints);
            return false;
        }

        return true;
    }

    updateUIElements() {
        try {
            // Update duration
            const durationElement = document.getElementById('duration');
            if (durationElement && this.metadata.fuzzer.duration) {
                durationElement.textContent = `Duration: ${this.metadata.fuzzer.duration}`;
            }
            
            // Calculate stats
            const stats = {
                totalRequests: this.metadata.fuzzer.total_requests || 0,
                criticalErrors: this.metadata.fuzzer.critical_issues || 0,
                uniqueEndpoints: this.metadata.total_endpoints || 0,
                successRate: this.metadata.summary.success_rate || 0
            };
            
            // Update stats elements
            document.getElementById('totalRequests').textContent = stats.totalRequests;
            document.getElementById('criticalErrors').textContent = stats.criticalErrors;
            document.getElementById('uniqueEndpoints').textContent = stats.uniqueEndpoints;
            document.getElementById('successRate').textContent = stats.successRate + '%';
            
        } catch (error) {
            console.error('Error updating UI elements:', error);
        }
    }

    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);
    }

    unsubscribe(key, callback) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key).delete(callback);
        }
    }

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

    setSearchQuery(query) {
        this.searchQuery = query;
        this.currentPage = 0;
        this.notifySubscribers('endpoints', this.getFilteredEndpoints());
    }

    setFilter(type, enabled) {
        this.filters[type] = enabled;
        this.currentPage = 0;
        this.notifySubscribers('endpoints', this.getFilteredEndpoints());
    }

    selectEndpoint(endpoint) {
        if (!this.dataLoader.validateEndpoint(endpoint)) {
            console.error('Invalid endpoint selected:', endpoint);
            return;
        }
        this.selectedEndpoint = endpoint;
        this.notifySubscribers('selectedEndpoint', endpoint);
    }

    getFilteredEndpoints() {
        try {
            const filtered = this.endpoints.filter(endpoint => {
                // Validate endpoint before filtering
                if (!this.dataLoader.validateEndpoint(endpoint)) {
                    console.error('Invalid endpoint found:', endpoint);
                    return false;
                }

                // Check if the endpoint type is enabled in filters
                if (!this.filters[endpoint.type]) {
                    console.log(`Filtering out endpoint with type: ${endpoint.type}`);
                    return false;
                }

                // Apply search filter if query exists
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
                totalPages: Math.ceil(filtered.length / this.itemsPerPage)
            };
        } catch (error) {
            console.error('Error filtering endpoints:', error);
            return {
                items: [],
                total: 0,
                page: 0,
                totalPages: 0
            };
        }
    }

    setPage(pageNum) {
        const totalPages = Math.ceil(this.endpoints.length / this.itemsPerPage);
        if (pageNum >= 0 && pageNum < totalPages) {
            this.currentPage = pageNum;
            this.notifySubscribers('endpoints', this.getFilteredEndpoints());
        }
    }

    getState() {
        return {
            metadata: this.metadata,
            coverage: this.coverage,
            endpoints: this.getFilteredEndpoints(),
            selectedEndpoint: this.selectedEndpoint,
            filters: this.filters,
            searchQuery: this.searchQuery
        };
    }
}

// Export for use in other modules
window.StateManager = StateManager;
