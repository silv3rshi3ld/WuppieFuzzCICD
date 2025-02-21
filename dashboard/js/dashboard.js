/**
 * Main dashboard class for handling fuzzing results visualization
 */
class Dashboard {
    constructor() {
        const fuzzerName = window.fuzzerName;
        if (!fuzzerName) {
            throw new Error('Fuzzer name not specified');
        }
        
        this.stateManager = new StateManager(fuzzerName);
        this.charts = new ChartsComponent();
        this.bugList = new BugListComponent();
        this.endpointTree = new EndpointTreeComponent();
        
        // Make endpointTree instance available globally for pagination
        window.endpointTree = this.endpointTree;
    }

    async initialize() {
        try {
            // Initialize state manager
            await this.stateManager.initialize();
            
            // Subscribe to state changes
            this.stateManager.subscribe('coverage', (coverage) => {
                this.updateCoverageMetrics(coverage);
            });
            
            this.stateManager.subscribe('metadata', (metadata) => {
                this.updateMetadata(metadata);
            });
            
            // Initialize charts
            this.updateCharts();
            
            // Initialize bug list with crashes
            this.bugList.createBugList(this.stateManager.state.data?.crashes || []);
            
            // Initialize endpoint tree
            this.endpointTree.createEndpointTree(this.stateManager.state.endpointsMeta?.endpoints || []);
            
            // Initialize feather icons
            if (window.feather) {
                feather.replace();
            }
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            this.showError(error);
        }
    }

    updateMetadata(metadata) {
        // Update duration
        const duration = document.getElementById('duration');
        if (duration) {
            duration.textContent = `Duration: ${metadata.duration || '00:00:00'}`;
        }
    }

    updateCoverageMetrics(coverage) {
        if (!coverage) return;

        // Update overall code coverage
        const codeCoverage = document.getElementById('codeCoverage');
        if (codeCoverage && coverage.lines) {
            const percentage = coverage.lines.percentage || 0;
            codeCoverage.textContent = `${percentage.toFixed(1)}%`;
        }

        // Update detailed coverage metrics
        ['lines', 'functions', 'branches', 'statements'].forEach(metric => {
            this.updateCoverageMetric(metric, coverage[metric]);
        });
    }

    updateCoverageMetric(metric, data) {
        if (!data) return;

        const covered = data.covered || 0;
        const total = data.total || 1;
        const percentage = data.percentage || 0;

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

    updateCharts() {
        const stats = this.stateManager.state.data?.stats;
        if (!stats) return;
        
        // Transform status distribution into chart format
        const statusDistribution = [
            {
                name: 'Hits',
                value: stats.statusDistribution?.hits || 0,
                color: '#22c55e'
            },
            {
                name: 'Misses',
                value: stats.statusDistribution?.misses || 0,
                color: '#ef4444'
            },
            {
                name: 'Unspecified',
                value: stats.statusDistribution?.unspecified || 0,
                color: '#6b7280'
            }
        ];
        
        // Create coverage distribution chart
        this.charts.createCoverageChart({
            status_distribution: statusDistribution
        });
        
        // Transform method coverage into chart format
        const methodCoverage = Object.entries(stats.methodCoverage || {}).map(([method, hits]) => ({
            method,
            hits,
            misses: 0  // We don't have misses data in our current format
        }));
        
        // Create method coverage chart
        this.charts.createMethodChart({
            method_coverage: methodCoverage
        });
        
        // Create status code distribution chart
        this.charts.createStatusChart({
            status_codes: stats.statusCodes || []
        });

        // Update stats
        const totalRequests = document.getElementById('totalRequests');
        if (totalRequests) {
            totalRequests.textContent = stats.total_requests || 0;
        }

        const criticalIssues = document.getElementById('criticalIssues');
        if (criticalIssues) {
            criticalIssues.textContent = stats.critical_issues || 0;
        }

        const uniqueEndpoints = document.getElementById('uniqueEndpoints');
        if (uniqueEndpoints) {
            uniqueEndpoints.textContent = stats.unique_endpoints || 0;
        }
    }

    showError(error) {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2 class="text-xl font-bold mb-4">Error Loading Dashboard</h2>
                    <p class="mb-4">An error occurred while loading the dashboard:</p>
                    <pre class="bg-gray-50 p-4 rounded">${error.toString()}</pre>
                    <a href="../index.html" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                        ← Back to Overview
                    </a>
                </div>
            `;
        }
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        const dashboard = new Dashboard();
        dashboard.initialize();
    } catch (error) {
        console.error('Error creating dashboard:', error);
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2 class="text-xl font-bold mb-4">Error Loading Dashboard</h2>
                    <p class="mb-4">An error occurred while loading the dashboard:</p>
                    <pre class="bg-gray-50 p-4 rounded">${error.toString()}</pre>
                    <a href="../index.html" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                        ← Back to Overview
                    </a>
                </div>
            `;
        }
    }
});
