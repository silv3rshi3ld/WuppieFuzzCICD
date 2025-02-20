// Chart initialization and configuration
window.initializeCharts = function() {
    const coverageChart = document.getElementById('coverageChart');
    const methodChart = document.getElementById('methodChart');
    const statusChart = document.getElementById('statusChart');

    // Coverage Distribution Chart (Pie)
    if (coverageChart) {
        new Chart(coverageChart, {
            type: 'pie',
            data: {
                labels: window.fuzzerData.stats.statusDistribution.map(item => item.name),
                datasets: [{
                    data: window.fuzzerData.stats.statusDistribution.map(item => item.value),
                    backgroundColor: window.fuzzerData.stats.statusDistribution.map(item => item.color)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Method Coverage Chart (Bar)
    if (methodChart) {
        const methodData = window.fuzzerData.stats.methodCoverage;
        new Chart(methodChart, {
            type: 'bar',
            data: {
                labels: methodData.map(item => item.method),
                datasets: [
                    {
                        label: 'Hits',
                        data: methodData.map(item => item.hits),
                        backgroundColor: '#22c55e'
                    },
                    {
                        label: 'Misses',
                        data: methodData.map(item => item.misses),
                        backgroundColor: '#ef4444'
                    },
                    {
                        label: 'Unspecified',
                        data: methodData.map(item => item.unspecified),
                        backgroundColor: '#f59e0b'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Status Code Distribution Chart (Bar)
    if (statusChart) {
        const statusData = window.fuzzerData.stats.statusCodes;
        new Chart(statusChart, {
            type: 'bar',
            data: {
                labels: statusData.map(item => item.status),
                datasets: [{
                    label: 'Count',
                    data: statusData.map(item => item.count),
                    backgroundColor: statusData.map(item => {
                        const code = parseInt(item.status);
                        if (code >= 200 && code < 300) return '#22c55e';
                        if (code >= 400 && code < 500) return '#f59e0b';
                        if (code >= 500) return '#ef4444';
                        return '#3b82f6';
                    })
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
};
