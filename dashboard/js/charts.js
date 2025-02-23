// Chart initialization and configuration
function initializeCharts() {
    const coverageChart = document.getElementById('coverageChart');
    const methodChart = document.getElementById('methodChart');
    const statusChart = document.getElementById('statusChart');
    
    const data = window.summaryData || {};

    // Coverage Distribution Chart (Pie)
    if (coverageChart) {
        new Chart(coverageChart, {
            type: 'pie',
            data: {
                labels: ['Hits', 'Misses', 'Unspecified'],
                datasets: [{
                    data: [
                        data.hits || 0,
                        data.misses || 0,
                        data.unspecified || 0
                    ],
                    backgroundColor: ['#22c55e', '#ef4444', '#f59e0b']
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
        new Chart(methodChart, {
            type: 'bar',
            data: {
                labels: ['GET', 'POST', 'PUT', 'DELETE'],
                datasets: [{
                    label: 'Hits',
                    data: [
                        data.get_hits || 0,
                        data.post_hits || 0,
                        data.put_hits || 0,
                        data.delete_hits || 0
                    ],
                    backgroundColor: '#22c55e'
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
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Status Code Distribution Chart (Bar)
    if (statusChart) {
        new Chart(statusChart, {
            type: 'bar',
            data: {
                labels: ['2xx', '4xx', '5xx'],
                datasets: [{
                    data: [
                        data.status_2xx || 0,
                        data.status_4xx || 0,
                        data.status_5xx || 0
                    ],
                    backgroundColor: ['#22c55e', '#f59e0b', '#ef4444']
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
}

// Expose the function globally
window.initializeCharts = initializeCharts;
