/**
 * State manager class for handling fuzzing results state and updates
 */
class StateManager {
    constructor(fuzzerName) {
        this.fuzzerName = fuzzerName;
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
        };
    }

    async initialize() {
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
            throw error;
        }
    }

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
    }
}

// Export for use in other modules
window.StateManager = StateManager;
