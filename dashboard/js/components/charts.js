/**
 * Charts component for displaying coverage and statistics
 */
class Charts {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.charts = {
            coverage: null,
            method: null,
            status: null
        };
        
        this.stateManager.subscribe('coverage', () => this.render());
    }
    
    render() {
        const coverage = this.stateManager.coverage;
        if (!coverage) return;
        
        this.renderCoverageChart(coverage.status_distribution);
        this.renderMethodChart(coverage.method_coverage);
        this.renderStatusChart(coverage.status_codes);
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
                    backgroundColor: ['#10B981', '#EF4444', '#6B7280']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
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
        
        this.charts.method = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: methods,
                datasets: [{
                    label: 'Requests',
                    data: values,
                    backgroundColor: '#10B981'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
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
            if (code >= 500) return '#EF4444';
            if (code >= 400) return '#F59E0B';
            if (code >= 300) return '#3B82F6';
            return '#10B981';
        });
        
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
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Export for use in other modules
window.Charts = Charts;
