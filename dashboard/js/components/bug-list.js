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

// Export for use in other modules
window.BugList = BugList;
