// Global namespace for our dashboard components
window.Dashboard = {
    utils: {
        formatNumber(num) {
            return new Intl.NumberFormat().format(num);
        }
    }
};

// Data loader
class DataLoader {
    constructor(fuzzerName) {
        this.fuzzerName = fuzzerName.toLowerCase();
    }

    loadMetadata() {
        try {
            return window[`${this.fuzzerName}Metadata`] || {};
        } catch (error) {
            console.error('Error loading metadata:', error);
            return {};
        }
    }

    loadCoverage() {
        try {
            return window[`${this.fuzzerName}Coverage`] || {};
        } catch (error) {
            console.error('Error loading coverage:', error);
            return {};
        }
    }

    loadEndpointChunk(chunkIndex) {
        try {
            return window[`${this.fuzzerName}Endpoints${chunkIndex}`] || [];
        } catch (error) {
            console.error('Error loading endpoint chunk:', error);
            return [];
        }
    }
}

// State manager
class StateManager {
    constructor(fuzzerName) {
        this.fuzzerName = fuzzerName;
        this.dataLoader = new DataLoader(fuzzerName);
        this.currentPage = 0;
        this.itemsPerPage = 25;
        this.searchQuery = '';
        this.filters = {
            hits: true,
            misses: true,
            unspecified: true
        };
        this.selectedEndpoint = null;
        this.subscribers = new Map();
        this.metadata = null;
        this.coverage = null;
        this.endpoints = [];
    }

    initialize() {
        try {
            this.metadata = this.dataLoader.loadMetadata();
            this.coverage = this.dataLoader.loadCoverage();
            this.endpoints = this.dataLoader.loadEndpointChunk(0) || [];
            
            this.notifySubscribers('metadata', this.metadata);
            this.notifySubscribers('coverage', this.coverage);
            this.notifySubscribers('endpoints', this.getFilteredEndpoints());
            
            const durationElement = document.getElementById('duration');
            if (durationElement && this.metadata.duration) {
                durationElement.textContent = `Duration: ${this.metadata.duration}`;
            }
            
            const stats = {
                totalRequests: this.metadata.total_requests || 0,
                criticalErrors: this.metadata.critical_issues || 0,
                uniqueEndpoints: this.endpoints.length || 0,
                successRate: this.coverage?.statusDistribution?.hits || 0
            };
            
            document.getElementById('totalRequests').textContent = stats.totalRequests;
            document.getElementById('criticalErrors').textContent = stats.criticalErrors;
            document.getElementById('uniqueEndpoints').textContent = stats.uniqueEndpoints;
            document.getElementById('successRate').textContent = stats.successRate + '%';
            
        } catch (error) {
            console.error('Error initializing state:', error);
            throw error;
        }
    }

    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);
    }

    unsubscribe(key, callback) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key).delete(callback);
        }
    }

    notifySubscribers(key, data) {
        if (this.subscribers.has(key)) {
            this.subscribers.get(key).forEach(callback => callback(data));
        }
    }

    setSearchQuery(query) {
        this.searchQuery = query;
        this.currentPage = 0;
        this.notifySubscribers('endpoints', this.getFilteredEndpoints());
    }

    setFilter(type, enabled) {
        this.filters[type] = enabled;
        this.currentPage = 0;
        this.notifySubscribers('endpoints', this.getFilteredEndpoints());
    }

    selectEndpoint(endpoint) {
        this.selectedEndpoint = endpoint;
        this.notifySubscribers('selectedEndpoint', endpoint);
    }

    getFilteredEndpoints() {
        const filtered = this.endpoints.filter(endpoint => {
            if (!this.filters[endpoint.type]) return false;
            if (this.searchQuery) {
                const searchLower = this.searchQuery.toLowerCase();
                return endpoint.path.toLowerCase().includes(searchLower) ||
                       endpoint.method.toLowerCase().includes(searchLower);
            }
            return true;
        });

        const start = this.currentPage * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        
        return {
            items: filtered.slice(start, end),
            total: filtered.length,
            page: this.currentPage,
            totalPages: Math.ceil(filtered.length / this.itemsPerPage)
        };
    }

    setPage(pageNum) {
        const totalPages = Math.ceil(this.endpoints.length / this.itemsPerPage);
        if (pageNum >= 0 && pageNum < totalPages) {
            this.currentPage = pageNum;
            this.notifySubscribers('endpoints', this.getFilteredEndpoints());
        }
    }

    getState() {
        return {
            metadata: this.metadata,
            coverage: this.coverage,
            endpoints: this.getFilteredEndpoints(),
            selectedEndpoint: this.selectedEndpoint,
            filters: this.filters,
            searchQuery: this.searchQuery
        };
    }
}

// Endpoint tree component
class EndpointTree {
    constructor(elementId, stateManager) {
        this.element = document.getElementById(elementId);
        this.stateManager = stateManager;
        
        this.stateManager.subscribe('endpoints', (data) => this.render(data));
    }
    
    render(data) {
        if (!data || !data.items) {
            this.element.innerHTML = '<div class="text-gray-500 text-center py-4">No endpoints found</div>';
            return;
        }
        
        const endpoints = data.items;
        if (endpoints.length === 0) {
            this.element.innerHTML = '<div class="text-gray-500 text-center py-4">No endpoints found</div>';
            return;
        }
        
        const groupedEndpoints = {};
        endpoints.forEach(endpoint => {
            if (!groupedEndpoints[endpoint.path]) {
                groupedEndpoints[endpoint.path] = [];
            }
            groupedEndpoints[endpoint.path].push(endpoint);
        });
        
        const html = Object.entries(groupedEndpoints).map(([path, methods]) => `
            <div class="endpoint-group">
                <div class="endpoint-path">${path}</div>
                <div class="endpoint-methods">
                    ${methods.map(method => `
                        <div class="endpoint-method ${method.type}" onclick="window.selectEndpoint('${method.path}', '${method.method}')">
                            <span class="method-badge ${method.method.toLowerCase()}">${method.method}</span>
                            <span class="status-code">${method.status_code || '-'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        this.element.innerHTML = html;
    }
}

// Bug list component
class BugList {
    constructor(elementId, stateManager) {
        this.element = document.getElementById(elementId);
        this.stateManager = stateManager;
        
        this.stateManager.subscribe('endpoints', (data) => this.render(data));
    }
    
    render(data) {
        if (!data || !data.items) {
            this.element.innerHTML = '<div class="text-gray-500 text-center py-4">No issues found</div>';
            return;
        }
        
        const endpoints = data.items;
        const issues = endpoints.filter(endpoint => endpoint.type === 'miss');
        
        if (issues.length === 0) {
            this.element.innerHTML = '<div class="text-gray-500 text-center py-4">No issues found</div>';
            return;
        }
        
        const html = issues.map(issue => `
            <div class="bug-item">
                <div class="bug-header">
                    <div class="bug-title">
                        <span class="method-badge ${issue.method.toLowerCase()}">${issue.method}</span>
                        <span class="bug-path">${issue.path}</span>
                    </div>
                    <div class="bug-status">
                        <span class="status-code ${issue.status_code >= 500 ? 'error' : 'warning'}">${issue.status_code}</span>
                    </div>
                </div>
                ${issue.name ? `<div class="bug-description">${issue.name}</div>` : ''}
            </div>
        `).join('');
        
        this.element.innerHTML = html;
    }
}

// Charts component
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
        
        this.renderCoverageChart(coverage.statusDistribution);
        this.renderMethodChart(coverage.methodCoverage);
        this.renderStatusChart(coverage.statusCodes);
    }
    
    renderCoverageChart(data) {
        const ctx = document.getElementById('coverageChart');
        if (!ctx) return;
        
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
        if (!ctx) return;
        
        if (this.charts.method) {
            this.charts.method.destroy();
        }
        
        const methods = Object.keys(data);
        const hits = methods.map(m => data[m].hits || 0);
        const misses = methods.map(m => data[m].misses || 0);
        
        this.charts.method = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: methods,
                datasets: [
                    {
                        label: 'Hits',
                        data: hits,
                        backgroundColor: '#10B981'
                    },
                    {
                        label: 'Misses',
                        data: misses,
                        backgroundColor: '#EF4444'
                    }
                ]
            },
            options: {
                responsive: true,
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
    
    renderStatusChart(data) {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;
        
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

// Global handler for endpoint selection
window.selectEndpoint = (path, method) => {
    const stateManager = window.currentStateManager;
    if (stateManager) {
        const endpoints = stateManager.endpoints;
        const endpoint = endpoints.find(e => e.path === path && e.method === method);
        if (endpoint) {
            stateManager.selectEndpoint(endpoint);
        }
    }
};
