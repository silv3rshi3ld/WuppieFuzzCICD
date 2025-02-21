/**
 * Main dashboard class for handling fuzzing results visualization
 */
class Dashboard {
    constructor() {
        const fuzzerName = window.fuzzerName;
        if (!fuzzerName) {
            throw new Error('Fuzzer name not specified');
        }
        
        // Get fuzzer data from the correct variables
        this.data = {
            metadata: window[`${fuzzerName}Metadata`] || {},
            coverage: window[`${fuzzerName}Coverage`] || {},
            endpoints: (window[`${fuzzerName}EndpointsMeta`] || {}).endpoints || [],
            bugs: (window[`${fuzzerName}Data`] || {}).bugs || [],
            stats: window[`${fuzzerName}Metadata`] || {}
        };
        
        if (!this.data.metadata) {
            throw new Error(`No data found for fuzzer: ${fuzzerName}`);
        }
        
        this.charts = new ChartsComponent();
        this.bugList = new BugListComponent();
        this.endpointTree = new EndpointTreeComponent();
        
        // Make endpointTree instance available globally for pagination
        window.endpointTree = this.endpointTree;
    }

    async initialize() {
        try {
            // Update stats
            this.updateStats();
            
            // Initialize charts
            this.updateCharts();
            
            // Initialize bug list
            this.bugList.createBugList(this.data.bugs || []);
            
            // Initialize endpoint tree
            this.endpointTree.createEndpointTree(this.data.endpoints || []);
            
            // Initialize feather icons
            if (window.feather) {
                feather.replace();
            }
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            this.showError(error);
        }
    }

    updateStats() {
        const stats = this.data.stats;
        
        // Update total requests
        const totalRequests = document.getElementById('totalRequests');
        if (totalRequests) {
            totalRequests.textContent = stats.total_requests || 0;
        }

        // Update critical issues
        const criticalIssues = document.getElementById('criticalIssues');
        if (criticalIssues) {
            criticalIssues.textContent = stats.critical_issues || 0;
        }

        // Update unique endpoints
        const uniqueEndpoints = document.getElementById('uniqueEndpoints');
        if (uniqueEndpoints) {
            uniqueEndpoints.textContent = stats.unique_endpoints || 0;
        }

        // Update code coverage
        const codeCoverage = document.getElementById('codeCoverage');
        if (codeCoverage) {
            const coverage = stats.code_coverage || 0;
            codeCoverage.textContent = `${coverage.toFixed(1)}%`;
        }

        // Update duration
        const duration = document.getElementById('duration');
        if (duration) {
            duration.textContent = `Duration: ${stats.duration || '00:00:00'}`;
        }

        // Update coverage metrics
        this.updateCoverageMetric('lines');
        this.updateCoverageMetric('functions');
        this.updateCoverageMetric('branches');
        this.updateCoverageMetric('statements');
    }

    updateCoverageMetric(metric) {
        const coverage = this.data.coverage[metric] || {};
        if (!coverage) return;

        const percentage = coverage.percentage || 0;
        const covered = coverage.covered || 0;
        const total = coverage.total || 0;

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
        const stats = this.data.stats;
        
        // Create coverage distribution chart
        this.charts.createCoverageChart({
            status_distribution: stats.status_distribution || []
        });
        
        // Create method coverage chart
        this.charts.createMethodChart({
            method_coverage: stats.method_coverage || []
        });
        
        // Create status code distribution chart
        this.charts.createStatusChart({
            status_codes: stats.status_codes || []
        });
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
