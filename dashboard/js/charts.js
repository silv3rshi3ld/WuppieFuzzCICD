<<<<<<< Updated upstream
// Redirect to component-based implementation
window.initializeCharts = function() {
    console.warn('Using legacy chart initialization. Please update to use ChartsComponent.');
    const charts = new ChartsComponent();
    const coverage = window[`${window.fuzzerName}Coverage`] || {};
    charts.createCoverageChart(coverage);
    charts.createMethodChart(coverage);
    charts.createStatusChart(coverage);
    charts.updateCoverageProgress();
};
=======
/**
 * Enhanced chart initialization and management with proper data handling,
 * loading states, and error handling
 */

class DashboardCharts {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.charts = new Map();
        this.loadingElements = new Map();
        this.errorElements = new Map();
        
        // Chart configurations
        this.chartConfigs = {
            coverage: {
                elementId: 'coverageChart',
                type: 'pie',
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            },
            method: {
                elementId: 'methodChart',
                type: 'bar',
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.parsed.y || 0} requests`;
                                }
                            }
                        }
                    }
                }
            },
            status: {
                elementId: 'statusChart',
                type: 'bar',
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed.y || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                    return `${value} requests (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            }
        };

        this.initialize();
    }

    initialize() {
        // Subscribe to data updates
        this.stateManager.subscribe('coverage', data => this.updateCoverageAndMethodCharts(data));
        this.stateManager.subscribe('endpoints', data => this.updateStatusChart(data));
        this.stateManager.subscribe('loading', loading => this.handleLoadingState(loading));
        this.stateManager.subscribe('error', error => this.handleError(error));

        // Initialize chart containers
        this.initializeChartContainers();
    }

    initializeChartContainers() {
        Object.entries(this.chartConfigs).forEach(([key, config]) => {
            const container = document.getElementById(config.elementId);
            if (!container) {
                console.warn(`Chart container not found: ${config.elementId}`);
                return;
            }

            // Create wrapper for loading and error states
            const wrapper = document.createElement('div');
            wrapper.className = 'chart-wrapper relative';
            container.parentNode.insertBefore(wrapper, container);
            wrapper.appendChild(container);

            // Add loading overlay
            const loadingEl = this.createLoadingElement();
            wrapper.appendChild(loadingEl);
            this.loadingElements.set(key, loadingEl);

            // Add error overlay
            const errorEl = this.createErrorElement();
            wrapper.appendChild(errorEl);
            this.errorElements.set(key, errorEl);
        });
    }

    createLoadingElement() {
        const el = document.createElement('div');
        el.className = 'chart-loading hidden absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center';
        el.innerHTML = `
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        `;
        return el;
    }

    createErrorElement() {
        const el = document.createElement('div');
        el.className = 'chart-error hidden absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center';
        el.innerHTML = `
            <div class="text-red-500 text-center">
                <i data-feather="alert-triangle" class="h-8 w-8 mx-auto mb-2"></i>
                <p class="error-message text-sm"></p>
            </div>
        `;
        return el;
    }

    handleLoadingState(loading) {
        this.loadingElements.forEach(el => {
            el.classList.toggle('hidden', !loading);
        });
    }

    handleError(error) {
        const errorEl = this.errorElements.get(error.component);
        if (errorEl) {
            const messageEl = errorEl.querySelector('.error-message');
            if (messageEl) {
                messageEl.textContent = error.message;
            }
            errorEl.classList.remove('hidden');
        }
    }

    updateCoverageAndMethodCharts(data) {
        if (!data) {
            console.warn('No coverage data available');
            return;
        }

        this.updateCoverageChart(data);
        this.updateMethodChart(data);
    }

    updateCoverageChart(data) {
        const config = this.chartConfigs.coverage;
        const chart = this.getOrCreateChart('coverage', config);
        
        if (!chart) return;

        const total = data.hits + data.misses;
        const coverageRate = total > 0 ? ((data.hits / total) * 100).toFixed(1) : 0;

        chart.data = {
            labels: ['Successful', 'Failed'],
            datasets: [{
                data: [
                    data.hits || 0,
                    data.misses || 0
                ],
                backgroundColor: ['#22c55e', '#ef4444']
            }]
        };
        
        // Update success rate display
        const successRateEl = document.querySelector('.success-rate');
        if (successRateEl) {
            successRateEl.textContent = `${coverageRate}%`;
        }
        
        chart.update();
    }

    updateMethodChart(data) {
        const config = this.chartConfigs.method;
        const chart = this.getOrCreateChart('method', config);
        
        if (!chart) return;

        const methods = data.methods || {};
        
        chart.data = {
            labels: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            datasets: [{
                data: [
                    methods.get || 0,
                    methods.post || 0,
                    methods.put || 0,
                    methods.delete || 0,
                    methods.patch || 0
                ],
                backgroundColor: '#22c55e'
            }]
        };
        
        chart.update();
    }

    updateStatusChart(data) {
        if (!data || !data.stats) {
            console.warn('No status distribution data available');
            return;
        }

        const config = this.chartConfigs.status;
        const chart = this.getOrCreateChart('status', config);
        
        if (!chart) return;

        const statusCounts = data.stats.statusCounts;
        
        chart.data = {
            labels: ['2xx', '4xx', '5xx'],
            datasets: [{
                data: [
                    statusCounts['2xx'] || 0,
                    statusCounts['4xx'] || 0,
                    statusCounts['5xx'] || 0
                ],
                backgroundColor: ['#22c55e', '#f59e0b', '#ef4444']
            }]
        };

        // Update total requests
        const totalEl = document.querySelector('.total-requests');
        if (totalEl) {
            totalEl.textContent = data.stats.totalRequests || 0;
        }
        
        chart.update();
    }

    getOrCreateChart(key, config) {
        if (this.charts.has(key)) {
            return this.charts.get(key);
        }

        const element = document.getElementById(config.elementId);
        if (!element) {
            console.error(`Chart element not found: ${config.elementId}`);
            return null;
        }

        try {
            const chart = new Chart(element, {
                type: config.type,
                data: {},
                options: config.options
            });

            this.charts.set(key, chart);
            return chart;
        } catch (error) {
            console.error(`Error creating chart ${key}:`, error);
            return null;
        }
    }

    destroy() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
    }
}

// Export for use in other modules
window.DashboardCharts = DashboardCharts;
>>>>>>> Stashed changes
