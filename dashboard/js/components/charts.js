/**
<<<<<<< Updated upstream
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
=======
 * Charts component for visualizing fuzzing results
 */
class Charts {
    constructor(data) {
        if (!data) {
            console.error('No data provided for charts');
            return;
        }

        this.data = data;
        this.initializeCharts();
    }

    initializeCharts() {
        try {
            this.createCoverageChart();
            this.createMethodChart();
            this.createStatusChart();
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    createCoverageChart() {
        const ctx = document.getElementById('coverageChart');
        if (!ctx) return;

        const coverage = this.data.coverage?.status_distribution || {};
        const hits = coverage.hits || 0;
        const misses = coverage.misses || 0;
        const total = hits + misses;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Successful', 'Failed', 'Unspecified'],
                datasets: [{
                    data: [
                        hits,
                        misses,
                        total === 0 ? 1 : 0 // Show full gray circle if no data
                    ],
                    backgroundColor: [
                        '#22c55e', // Success - Green
                        '#ef4444', // Failed - Red
                        '#94a3b8'  // Unspecified - Gray
                    ],
                    borderWidth: 0
>>>>>>> Stashed changes
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
<<<<<<< Updated upstream
                cutout: '60%',
=======
>>>>>>> Stashed changes
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
<<<<<<< Updated upstream
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
=======
                            usePointStyle: true,
                            padding: 20
>>>>>>> Stashed changes
                        }
                    }
                }
            }
        });
    }

<<<<<<< Updated upstream
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
=======
    createMethodChart() {
        const ctx = document.getElementById('methodChart');
        if (!ctx) return;

        const methodCoverage = this.data.coverage?.method_coverage || {};
        const methods = Object.keys(methodCoverage);
        const successData = [];
        const failureData = [];

        methods.forEach(method => {
            const stats = methodCoverage[method];
            successData.push(stats.hits || 0);
            failureData.push(stats.misses || 0);
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: methods,
                datasets: [
                    {
                        label: 'Successful',
                        data: successData,
                        backgroundColor: '#22c55e',
                        stack: 'Stack 0'
                    },
                    {
                        label: 'Failed',
                        data: failureData,
                        backgroundColor: '#ef4444',
                        stack: 'Stack 0'
                    }
                ]
>>>>>>> Stashed changes
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
<<<<<<< Updated upstream
                    x: { 
                        stacked: true,
                        grid: { display: false }
                    },
                    y: { 
                        stacked: true,
                        beginAtZero: true,
                        grid: { color: '#f3f4f6' }
=======
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
>>>>>>> Stashed changes
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
<<<<<<< Updated upstream
                            padding: 20,
                            font: { size: 13 }
=======
                            usePointStyle: true,
                            padding: 20
>>>>>>> Stashed changes
                        }
                    }
                }
            }
        });
    }

<<<<<<< Updated upstream
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
=======
    createStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        const endpoints = this.data.endpoints || [];
        const statusCounts = this.countStatusCodes(endpoints);
        
        // Sort status codes into categories
        const categories = {
            'Success (2xx)': this.sumRange(statusCounts, 200, 299),
            'Redirect (3xx)': this.sumRange(statusCounts, 300, 399),
            'Client Error (4xx)': this.sumRange(statusCounts, 400, 499),
            'Server Error (5xx)': this.sumRange(statusCounts, 500, 599)
        };

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: [
                        '#22c55e', // Success - Green
                        '#f59e0b', // Redirect - Orange
                        '#3b82f6', // Client Error - Blue
                        '#ef4444'  // Server Error - Red
                    ],
                    borderWidth: 0
>>>>>>> Stashed changes
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
<<<<<<< Updated upstream
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
=======
                        beginAtZero: true,
                        grid: {
                            display: true
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
>>>>>>> Stashed changes
                    }
                }
            }
        });
    }

    countStatusCodes(endpoints) {
        const counts = {};
        endpoints.forEach(endpoint => {
            const status = endpoint.status_code || 0;
            counts[status] = (counts[status] || 0) + 1;
        });
        return counts;
    }

    sumRange(counts, start, end) {
        let sum = 0;
        for (let i = start; i <= end; i++) {
            sum += counts[i] || 0;
        }
        return sum;
    }
}

// Export for use in other modules
window.ChartsComponent = ChartsComponent;
