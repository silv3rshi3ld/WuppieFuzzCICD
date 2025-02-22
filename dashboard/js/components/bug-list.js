/**
 * Bug list component for displaying test failures and issues
 */
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
        const issues = endpoints.filter(endpoint => endpoint.success_rate < 100);
        
        if (issues.length === 0) {
            this.element.innerHTML = '<div class="text-gray-500 text-center py-4">No issues found</div>';
            return;
        }
        
        const html = issues.map(issue => `
            <div class="bug-item border-l-4 ${issue.success_rate === 0 ? 'border-red-500' : 'border-yellow-500'} bg-white p-4 mb-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-2">
                        <span class="px-2 py-1 rounded text-xs font-medium ${this.getMethodClass(issue.method)}">
                            ${issue.method}
                        </span>
                        <span class="font-mono text-sm">${issue.path}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium ${issue.success_rate === 0 ? 'text-red-600' : 'text-yellow-600'}">
                            ${issue.success_rate}% success rate
                        </span>
                        <span class="text-sm text-gray-500">
                            (${issue.total_requests} requests)
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.element.innerHTML = html;
    }

    getMethodClass(method) {
        const classes = {
            'GET': 'bg-blue-100 text-blue-800',
            'POST': 'bg-green-100 text-green-800',
            'PUT': 'bg-yellow-100 text-yellow-800',
            'DELETE': 'bg-red-100 text-red-800',
            'PATCH': 'bg-purple-100 text-purple-800'
        };
        return classes[method.toUpperCase()] || 'bg-gray-100 text-gray-800';
    }
}

// Export for use in other modules
window.BugList = BugList;
