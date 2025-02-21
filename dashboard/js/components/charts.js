/**
 * Charts component for handling all chart visualizations
 */
class ChartsComponent {
    constructor() {
        this.charts = {};
    }

    destroyChart(chartId) {
        // Destroy existing chart instance
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            this.charts[chartId] = null;
        }
        
        // Also destroy any Chart.js instances on the canvas
        const canvas = document.getElementById(`${chartId}Chart`);
        if (canvas) {
            const existingChart = Chart.getChart(canvas);
            if (existingChart) {
                existingChart.destroy();
            }
        }
    }

    createCoverageChart(data) {
        this.destroyChart('coverage');
        const ctx = document.getElementById('coverageChart');
        if (!ctx) return;

        const statusDist = data.status_distribution || [];
        this.charts.coverage = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: statusDist.map(d => d.name),
                datasets: [{
                    data: statusDist.map(d => d.value),
                    backgroundColor: statusDist.map(d => d.color)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: { size: 13 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return `${context.label}: ${value.toFixed(1)}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    createMethodChart(data) {
        this.destroyChart('method');
        const ctx = document.getElementById('methodChart');
        if (!ctx) return;

        const methodCoverage = data.method_coverage || [];
        const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
        const datasets = [
            {
                label: 'Hits',
                data: methods.map(method => {
                    const entry = methodCoverage.find(m => m.method === method);
                    return entry ? entry.hits : 0;
                }),
                backgroundColor: '#22c55e'
            },
            {
                label: 'Misses',
                data: methods.map(method => {
                    const entry = methodCoverage.find(m => m.method === method);
                    return entry ? entry.misses : 0;
                }),
                backgroundColor: '#ef4444'
            }
        ];

        this.charts.method = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: methods,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { 
                        stacked: true,
                        grid: { display: false }
                    },
                    y: { 
                        stacked: true,
                        beginAtZero: true,
                        grid: { color: '#f3f4f6' }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: { size: 13 }
                        }
                    }
                }
            }
        });
    }

    createStatusChart(data) {
        this.destroyChart('status');
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        const statusCodes = data.status_codes || [];
        const statusData = statusCodes.map(d => ({
            status: d.status,
            count: d.count,
            color: parseInt(d.status) >= 500 ? '#dc2626' :
                   parseInt(d.status) >= 400 ? '#f59e0b' :
                   parseInt(d.status) >= 200 && parseInt(d.status) < 300 ? '#22c55e' :
                   '#6b7280'
        }));

        this.charts.status = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: statusData.map(d => d.status),
                datasets: [{
                    label: 'Count',
                    data: statusData.map(d => d.count),
                    backgroundColor: statusData.map(d => d.color),
                    borderWidth: statusData.map(d => parseInt(d.status) >= 500 ? 3 : 1),
                    borderColor: statusData.map(d => parseInt(d.status) >= 500 ? '#991b1b' : 'transparent'),
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: {
                                size: 13,
                                weight: (ctx) => parseInt(ctx.tick.label) >= 500 ? 'bold' : 'normal'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f3f4f6' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const status = context.label;
                                const count = context.raw;
                                let description = '';
                                
                                if (parseInt(status) >= 500) {
                                    description = '⚠️ CRITICAL: Server Error!\nRequires immediate investigation';
                                } else if (parseInt(status) >= 400) {
                                    description = 'Client Error - Check Request Parameters';
                                } else if (parseInt(status) >= 200 && parseInt(status) < 300) {
                                    description = 'Success - Expected Response';
                                } else if (parseInt(status) >= 300 && parseInt(status) < 400) {
                                    description = 'Redirection - Check Location Header';
                                }
                                
                                return [
                                    `Count: ${count}`,
                                    description
                                ];
                            }
                        },
                        titleFont: {
                            size: 14,
                            weight: (ctx) => parseInt(ctx.label) >= 500 ? 'bold' : 'normal'
                        },
                        bodyFont: { size: 13 },
                        padding: 12
                    }
                }
            }
        });
    }
}

// Export for use in other modules
window.ChartsComponent = ChartsComponent;
