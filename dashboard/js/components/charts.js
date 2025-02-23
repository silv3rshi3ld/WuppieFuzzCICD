/**
 * Enhanced charts component for displaying coverage and statistics
 * with support for loading states and error handling
 */
class Charts {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.charts = {
            coverage: null,
            method: null,
            status: null
        };
        
        // Get colors from CSS variables
        const style = getComputedStyle(document.documentElement);
        this.colors = {
            critical: style.getPropertyValue('--color-severity-critical') || '#dc2626',
            mediumHigh: style.getPropertyValue('--color-severity-medium-high') || '#f97316',
            medium: style.getPropertyValue('--color-severity-medium') || '#eab308',
            low: style.getPropertyValue('--color-severity-low') || '#3b82f6',
            info: style.getPropertyValue('--color-severity-info') || '#6b7280',
            success: style.getPropertyValue('--color-success') || '#22c55e'
        };
        
        // Subscribe to both data and loading state changes
        this.stateManager.subscribe('coverage', () => this.render());
        this.stateManager.subscribe('loadingState', (state) => this.handleLoadingState(state));
    }
    
    /**
     * Handle loading state changes
     */
    handleLoadingState(state) {
        const chartContainers = ['coverageChart', 'methodChart', 'statusChart'];
        
        chartContainers.forEach(id => {
            const container = document.getElementById(id)?.parentElement;
            if (!container) return;

            const loadingOverlay = container.querySelector('.chart-loading-overlay') || 
                                 this.createLoadingOverlay();

            if (state.components.includes('coverage')) {
                // Show loading state
                container.style.position = 'relative';
                if (!container.contains(loadingOverlay)) {
                    container.appendChild(loadingOverlay);
                }
                loadingOverlay.classList.remove('hidden');
            } else {
                // Hide loading state
                loadingOverlay.classList.add('hidden');
            }

            // Show error if present
            if (state.errors.coverage) {
                this.showChartError(container, state.errors.coverage);
            }
        });
    }

    /**
     * Create loading overlay element
     */
    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'chart-loading-overlay hidden';
        overlay.innerHTML = `
            <div class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <div class="text-center">
                    <i data-feather="loader" class="h-8 w-8 text-blue-500 animate-spin"></i>
                    <p class="mt-2 text-sm text-gray-600">Loading chart data...</p>
                </div>
            </div>
        `;
        feather.replace(overlay.querySelector('[data-feather]'));
        return overlay;
    }

    /**
     * Show error state for chart
     */
    showChartError(container, error) {
        const errorOverlay = document.createElement('div');
        errorOverlay.className = 'chart-error-overlay';
        errorOverlay.innerHTML = `
            <div class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                <div class="text-center">
                    <i data-feather="alert-triangle" class="h-8 w-8 text-red-500"></i>
                    <p class="mt-2 text-sm text-red-600">${error.message}</p>
                    <button class="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                        Retry
                    </button>
                </div>
            </div>
        `;
        
        // Add retry handler
        errorOverlay.querySelector('button').addEventListener('click', () => {
            this.stateManager.updateComponent('coverage');
        });

        feather.replace(errorOverlay.querySelector('[data-feather]'));
        
        // Remove any existing error overlay
        container.querySelectorAll('.chart-error-overlay').forEach(el => el.remove());
        container.appendChild(errorOverlay);
    }
    
    /**
     * Render all charts with error handling
     */
    render() {
        const coverage = this.stateManager.componentData?.coverage;
        if (!coverage) {
            console.warn('No coverage data available');
            return;
        }
        
        try {
            this.renderCoverageChart(coverage.status_distribution);
            this.renderMethodChart(coverage.method_coverage);
            this.renderStatusChart(coverage.status_codes);
        } catch (error) {
            console.error('Error rendering charts:', error);
            this.handleChartError(error);
        }
    }

    /**
     * Handle chart rendering errors
     */
    handleChartError(error) {
        const chartContainers = ['coverageChart', 'methodChart', 'statusChart'];
        chartContainers.forEach(id => {
            const container = document.getElementById(id)?.parentElement;
            if (container) {
                this.showChartError(container, error);
            }
        });
    }
    
    renderCoverageChart(data) {
        const ctx = document.getElementById('coverageChart');
        if (!ctx || !data) return;
        
        if (this.charts.coverage) {
            this.charts.coverage.destroy();
        }
        
        this.charts.coverage = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Hits', 'Misses', 'Unspecified'],
                datasets: [{
                    data: [data.hits || 0, data.misses || 0, data.unspecified || 0],
                    backgroundColor: [this.colors.success, this.colors.critical, this.colors.info]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                                return `${context.label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    renderMethodChart(data) {
        const ctx = document.getElementById('methodChart');
        if (!ctx || !data) return;
        
        if (this.charts.method) {
            this.charts.method.destroy();
        }
        
        const methods = Object.keys(data);
        const values = methods.map(m => data[m]);
        
        // Color mapping for HTTP methods
        const methodColors = {
            'GET': '#3B82F6',    // Blue
            'POST': '#10B981',   // Green
            'PUT': '#F59E0B',    // Yellow
            'DELETE': '#EF4444', // Red
            'PATCH': '#8B5CF6'   // Purple
        };
        
        this.charts.method = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: methods,
                datasets: [{
                    label: 'Requests',
                    data: values,
                    backgroundColor: methods.map(m => methodColors[m] || this.colors.info)
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Requests'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.raw} requests`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    renderStatusChart(data) {
        const ctx = document.getElementById('statusChart');
        if (!ctx || !data) return;
        
        if (this.charts.status) {
            this.charts.status.destroy();
        }
        
        const statusCodes = data.map(s => s.status);
        const counts = data.map(s => s.count);
        const colors = statusCodes.map(code => {
            const numCode = parseInt(code);
            if (numCode >= 500) return this.colors.critical;        // Critical
            if ([401, 403].includes(numCode)) return this.colors.mediumHigh; // Medium-High
            if (numCode >= 400) return this.colors.medium;         // Medium
            if (numCode === 404) return this.colors.low;           // Low
            if (numCode >= 300) return this.colors.info;           // Informational
            return this.colors.success;                            // Success
        });

        const severityLabels = {
            500: 'Critical',
            401: 'Medium-High',
            400: 'Medium',
            404: 'Low',
            300: 'Informational',
            200: 'Success'
        };
        
        this.charts.status = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: statusCodes,
                datasets: [{
                    data: counts,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Responses'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const code = context.label;
                                const numCode = parseInt(code);
                                let severity = 'Success';
                                
                                if (numCode >= 500) severity = severityLabels[500];
                                else if ([401, 403].includes(numCode)) severity = severityLabels[401];
                                else if (numCode >= 400) severity = severityLabels[400];
                                else if (numCode === 404) severity = severityLabels[404];
                                else if (numCode >= 300) severity = severityLabels[300];
                                
                                return [
                                    `Status ${code}: ${context.raw} responses`,
                                    `Severity: ${severity}`
                                ];
                            }
                        }
                    }
                }
            }
        });
    }
}

// Export for use in other modules
window.Charts = Charts;
