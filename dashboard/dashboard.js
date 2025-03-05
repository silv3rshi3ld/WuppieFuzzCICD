// Global chart instances
let chartInstances = {};

// Enhanced chart initialization with better error handling
function initializeCharts() {
    // Clean up existing charts
    Object.entries(chartInstances).forEach(([key, chart]) => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
            chartInstances[key] = null;
        }
    });

    // Set chart defaults
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.legend.position = 'bottom';

    try {
        // Initialize each chart
        chartInstances.coverage = createCoverageChart();
        chartInstances.method = createMethodChart();
        chartInstances.status = createStatusChart();
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function createCoverageChart() {
    const canvas = document.getElementById('coverageChart');
    if (!canvas) return null;

    return new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: window.fuzzerData.stats.statusDistribution.map(d => d.name),
            datasets: [{
                data: window.fuzzerData.stats.statusDistribution.map(d => d.value),
                backgroundColor: window.fuzzerData.stats.statusDistribution.map(d => d.color)
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
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function createMethodChart() {
    const canvas = document.getElementById('methodChart');
    if (!canvas) return null;

    return new Chart(canvas, {
        type: 'bar',
        data: {
            labels: window.fuzzerData.stats.methodCoverage.map(d => d.method),
            datasets: [
                {
                    label: 'Hits',
                    data: window.fuzzerData.stats.methodCoverage.map(d => d.hits),
                    backgroundColor: '#22c55e'
                },
                {
                    label: 'Misses',
                    data: window.fuzzerData.stats.methodCoverage.map(d => d.misses),
                    backgroundColor: '#ef4444'
                },
                {
                    label: 'Unspecified',
                    data: window.fuzzerData.stats.methodCoverage.map(d => d.unspecified),
                    backgroundColor: '#f59e0b'
                }
            ]
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

function createStatusChart() {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return null;

    const statusData = window.fuzzerData.stats.statusCodes.map(d => ({
        ...d,
        color: parseInt(d.status) >= 500 ? '#dc2626' :
               parseInt(d.status) >= 400 ? '#f59e0b' :
               parseInt(d.status) >= 200 && parseInt(d.status) < 300 ? '#22c55e' :
               '#6b7280'
    }));

    return new Chart(canvas, {
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

// Enhanced status handling
function getStatusDescription(status) {
    const statusNum = parseInt(status);
    if (statusNum >= 500) {
        return '⚠️ CRITICAL: Server Error - Requires Immediate Attention!\nThis indicates a serious issue that needs to be investigated.';
    }
    if (statusNum >= 400) return 'Client Error - Check Request Parameters';
    if (statusNum >= 200 && statusNum < 300) return 'Success - Expected Response';
    if (statusNum >= 300 && statusNum < 400) return 'Redirection - Check Location Header';
    return 'Unknown Status';
}

function getStatusClass(status) {
    const statusNum = parseInt(status);
    if (statusNum >= 500) return 'status-500';
    if (statusNum >= 400) return 'status-400';
    if (statusNum >= 200 && statusNum < 300) return 'status-200';
    return 'status-other';
}

// Enhanced search functionality
function filterBugs(bugs, query) {
    query = query.toLowerCase().trim();
    if (!query) return bugs;
    
    return bugs.filter(bug => 
        bug.endpoint.toLowerCase().includes(query) ||
        bug.method.toLowerCase().includes(query) ||
        bug.status.toLowerCase().includes(query) ||
        (bug.request && bug.request.toLowerCase().includes(query))
    );
}

// Initialize Feather icons
function initializeIcons() {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}
