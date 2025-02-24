/**
<<<<<<< Updated upstream
 * State manager class for handling fuzzing results state and updates
=======
 * Enhanced state manager for handling data loading and component updates
 * with proper error handling and state management
>>>>>>> Stashed changes
 */
class StateManager {
    constructor(fuzzerName) {
        this.fuzzerName = fuzzerName;
<<<<<<< Updated upstream
        this.dataLoader = new DataLoader(fuzzerName);
        this.subscribers = {
            coverage: [],
            metadata: [],
            crashes: [],
            endpoints: []
        };
        this.state = {
            coverage: null,
            metadata: null,
            data: null,
            endpointsMeta: null,
            endpoints: []
=======
        this.subscribers = new Map();
        this.searchQuery = '';
        this.dataLoader = null;
        this.state = {
            loading: false,
            initialized: false,
            components: new Set(),
            errors: new Map(),
            data: new Map()
>>>>>>> Stashed changes
        };
    }

    async initialize() {
<<<<<<< Updated upstream
        try {
            // Load initial data
            const [coverage, metadata, data, endpointsMeta] = await Promise.all([
                this.dataLoader.loadCoverage(),
                this.dataLoader.loadMetadata(),
                this.dataLoader.loadData(),
                this.dataLoader.loadEndpointsMeta()
            ]);

            // Update state
            this.state.coverage = coverage;
            this.state.metadata = metadata;
            this.state.data = data;
            this.state.endpointsMeta = endpointsMeta;

            // Notify subscribers
            this.notifySubscribers('coverage', coverage);
            this.notifySubscribers('metadata', metadata);
            this.notifySubscribers('crashes', data?.crashes || []);
            this.notifySubscribers('endpoints', endpointsMeta?.endpoints || []);

            // Dispatch data loaded event
            const eventData = {
                coverage: coverage,
                metadata: metadata,
                stats: data?.stats || {},
                crashes: data?.crashes || [],
                issues: data?.issues || []
            };
            
            window.dispatchEvent(new CustomEvent(`${this.fuzzerName.toLowerCase()}DataLoaded`, {
                detail: eventData
            }));

            // Update UI elements
            this.updateStats();
        } catch (error) {
            console.error('Error initializing state:', error);
=======
        if (this.state.initialized) return;

        try {
            this.setLoading(true);
            
            // Create and initialize data loader
            this.dataLoader = new DataLoader(this.fuzzerName);
            await this.dataLoader.initialize();
            
            // Load initial data
            const metadata = await this.loadComponentData('metadata');
            if (!metadata) {
                throw new Error('Failed to load initial metadata');
            }

            this.state.initialized = true;
            this.setLoading(false);
        } catch (error) {
            this.handleError('initialization', error);
            throw error;
        }
    }

    updateStatistics(metadata) {
        if (!metadata || !metadata.summary) return;

        const summary = metadata.summary;
        
        // Update total requests
        const totalRequestsEl = document.querySelector('.total-requests');
        if (totalRequestsEl) {
            totalRequestsEl.textContent = summary.total_requests || 0;
        }

        // Update critical errors
        const criticalErrorsEl = document.getElementById('criticalErrors');
        if (criticalErrorsEl) {
            criticalErrorsEl.textContent = summary.error_count || 0;
        }

        // Update unique endpoints
        const uniqueEndpointsEl = document.getElementById('uniqueEndpoints');
        if (uniqueEndpointsEl) {
            uniqueEndpointsEl.textContent = summary.unique_endpoints || 0;
        }

        // Update success rate
        const successRateEl = document.querySelector('.success-rate');
        if (successRateEl) {
            successRateEl.textContent = `${(summary.success_rate || 0).toFixed(2)}%`;
        }
    }

    setLoading(loading, component = null) {
        if (component) {
            if (loading) {
                this.state.components.add(component);
            } else {
                this.state.components.delete(component);
            }
        }
        this.state.loading = loading || this.state.components.size > 0;
        this.notifySubscribers('loading', this.state.loading);
    }

    handleError(component, error) {
        console.error(`Error in ${component}:`, error);
        this.state.errors.set(component, {
            message: error.message,
            timestamp: Date.now()
        });
        this.notifySubscribers('error', {
            component,
            error: error.message
        });
    }

    subscribe(component, callback) {
        if (!this.subscribers.has(component)) {
            this.subscribers.set(component, new Set());
        }
        this.subscribers.get(component).add(callback);

        // Push initial data if available
        const data = this.state.data.get(component);
        if (data) {
            callback(data);
        }
    }

    unsubscribe(component, callback) {
        if (this.subscribers.has(component)) {
            this.subscribers.get(component).delete(callback);
        }
    }

    notifySubscribers(component, data) {
        if (this.subscribers.has(component)) {
            this.subscribers.get(component).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${component} subscriber:`, error);
                }
            });
        }
    }

    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase();
        this.updateEndpointTree();
    }

    async updateEndpointTree() {
        try {
            const data = await this.loadComponentData('endpoints');
            if (!data || !data.items) return;

            const filteredEndpoints = this.filterEndpoints(data.items);
            
            this.notifySubscribers('endpoints', {
                items: filteredEndpoints,
                hasMore: data.hasMore,
                stats: data.stats
            });
        } catch (error) {
            this.handleError('endpoints', error);
        }
    }

    filterEndpoints(endpoints) {
        return endpoints.filter(endpoint => {
            const path = endpoint.path?.toLowerCase() || '';
            const method = endpoint.http_method?.toLowerCase() || '';
            return !this.searchQuery || 
                path.includes(this.searchQuery) || 
                method.includes(this.searchQuery);
        });
    }

    async loadComponentData(component) {
        if (!this.dataLoader) {
            throw new Error('Data loader not initialized');
        }

        this.setLoading(true, component);

        try {
            let data;
            switch (component) {
                case 'metadata':
                    data = await this.dataLoader.loadMetadata();
                    this.updateStatistics(data);
                    break;
                case 'coverage':
                    data = await this.dataLoader.loadCoverage();
                    break;
                case 'endpoints':
                    data = await this.dataLoader.loadEndpoints();
                    break;
                case 'bugs':
                    data = await this.dataLoader.loadBugs();
                    break;
                default:
                    throw new Error(`Unknown component: ${component}`);
            }

            this.state.data.set(component, data);
            this.state.errors.delete(component);
            this.setLoading(false, component);
            this.notifySubscribers(component, data);

            return data;
        } catch (error) {
            this.handleError(component, error);
            this.setLoading(false, component);
>>>>>>> Stashed changes
            throw error;
        }
    }

<<<<<<< Updated upstream
    subscribe(type, callback) {
        if (this.subscribers[type]) {
            this.subscribers[type].push(callback);
            // Call immediately if we have data
            if (this.state[type]) {
                callback(this.state[type]);
            }
        }
    }

    notifySubscribers(type, data) {
        if (this.subscribers[type]) {
            this.subscribers[type].forEach(callback => callback(data));
        }
    }

    updateStats() {
        // Update total requests
        const totalRequests = document.getElementById('totalRequests');
        if (totalRequests) {
            totalRequests.textContent = this.state.data?.stats?.total_requests || 0;
        }

        // Update critical issues
        const criticalIssues = document.getElementById('criticalIssues');
        if (criticalIssues) {
            criticalIssues.textContent = this.state.data?.stats?.critical_issues || 0;
        }

        // Update unique endpoints
        const uniqueEndpoints = document.getElementById('uniqueEndpoints');
        if (uniqueEndpoints) {
            uniqueEndpoints.textContent = this.state.data?.stats?.unique_endpoints || 0;
        }

        // Update code coverage
        const codeCoverage = document.getElementById('codeCoverage');
        if (codeCoverage) {
            const coverage = this.state.coverage?.lines || {};
            const covered = coverage.covered || 0;
            const total = coverage.total || 1;
            const percentage = (covered / total) * 100;
            codeCoverage.textContent = `${percentage.toFixed(1)}%`;
        }

        // Update duration
        const duration = document.getElementById('duration');
        if (duration) {
            duration.textContent = `Duration: ${this.state.metadata?.duration || '00:00:00'}`;
        }

        // Update coverage metrics
        this.updateCoverageMetric('lines');
        this.updateCoverageMetric('functions');
        this.updateCoverageMetric('branches');
        this.updateCoverageMetric('statements');
    }

    updateCoverageMetric(metric) {
        const coverage = this.state.coverage;
        if (!coverage) return;

        const metricData = coverage[metric] || {};
        const covered = metricData.covered || 0;
        const total = metricData.total || 1;
        const percentage = (covered / total) * 100;

        const valueElement = document.getElementById(`${metric}Coverage`);
        const rawElement = document.getElementById(`${metric}CoverageRaw`);
        const barElement = document.getElementById(`${metric}CoverageBar`);

        if (valueElement) {
            valueElement.textContent = `${percentage.toFixed(1)}%`;
        }
        if (rawElement) {
            rawElement.textContent = `${covered} / ${total}`;
        }
        if (barElement) {
            barElement.style.width = `${percentage}%`;
        }
=======
    async refreshData(component = null) {
        try {
            if (component) {
                // Refresh specific component
                this.state.data.delete(component);
                await this.loadComponentData(component);
            } else {
                // Refresh all components
                this.state.data.clear();
                await Promise.all([
                    this.loadComponentData('metadata'),
                    this.loadComponentData('coverage'),
                    this.loadComponentData('endpoints'),
                    this.loadComponentData('bugs')
                ]);
            }
        } catch (error) {
            this.handleError(component || 'refresh', error);
        }
    }

    getLoadingState() {
        return {
            loading: this.state.loading,
            components: Array.from(this.state.components)
        };
    }

    getErrors() {
        return Array.from(this.state.errors.entries()).map(([component, error]) => ({
            component,
            message: error.message,
            timestamp: error.timestamp
        }));
>>>>>>> Stashed changes
    }
}

// Export for use in other modules
window.StateManager = StateManager;
