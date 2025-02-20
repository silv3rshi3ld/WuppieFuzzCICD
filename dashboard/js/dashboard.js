/**
 * Main dashboard initialization
 */
window.Dashboard = {
    init() {
        // Initialize icons
        feather.replace();
        
        // Load summary data
        const summary = window.summaryData || {};
        
        // Update overall statistics
        document.getElementById('totalRequests').textContent = summary.total_requests || 0;
        document.getElementById('criticalErrors').textContent = summary.critical_issues || 0;
        document.getElementById('uniqueEndpoints').textContent = summary.unique_endpoints || 0;
        document.getElementById('successRate').textContent = (summary.success_rate || 0) + '%';
        
        // Update fuzzer cards
        const fuzzerCards = document.getElementById('fuzzerCards');
        if (fuzzerCards && summary.fuzzers) {
            const html = Object.entries(summary.fuzzers).map(([name, data]) => `
                <div class="fuzzer-card">
                    <div class="fuzzer-header">
                        <h3 class="fuzzer-title">${name.charAt(0).toUpperCase() + name.slice(1)} Results</h3>
                        <a href="pages/${name}.html" class="fuzzer-link">View Details</a>
                    </div>
                    <div class="fuzzer-stats">
                        <div class="fuzzer-stat">
                            <span class="stat-label">Total Requests</span>
                            <span class="stat-value">${data.total_requests || 0}</span>
                        </div>
                        <div class="fuzzer-stat">
                            <span class="stat-label">Critical Issues</span>
                            <span class="stat-value critical-error">${data.critical_issues || 0}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            fuzzerCards.innerHTML = html;
        }
    }
};
