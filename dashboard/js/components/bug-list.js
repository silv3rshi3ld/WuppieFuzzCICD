/**
 * Enhanced bug list component for displaying test failures and issues
 * with support for loading states and error handling
 */
class BugList {
    constructor(elementId, stateManager) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.error(`Element with id '${elementId}' not found`);
            return;
        }
        this.stateManager = stateManager;
        this.loadingState = false;
        
        // Subscribe to both data and loading state changes
        this.stateManager.subscribe('endpoints', (data) => this.render(data));
        this.stateManager.subscribe('loadingState', (state) => this.handleLoadingState(state));
    }
    
    /**
     * Handle loading state changes
     */
    handleLoadingState(state) {
        if (state.loading && state.components.includes('endpoints')) {
            this.showLoadingState();
        } else {
            this.hideLoadingState();
        }

        // Show error if present
        if (state.errors.endpoints) {
            this.showError(state.errors.endpoints.message);
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        if (!this.loadingState) {
            this.loadingState = true;
            this.element.innerHTML = `
                <div class="text-center py-8">
                    <i data-feather="loader" class="inline-block h-8 w-8 text-blue-500 animate-spin"></i>
                    <p class="mt-2 text-sm text-gray-600">Analyzing issues...</p>
                </div>
            `;
            feather.replace();
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        this.loadingState = false;
    }

    /**
     * Show error state
     */
    showError(message) {
        this.element.innerHTML = `
            <div class="text-red-500 text-center py-8">
                <i data-feather="alert-triangle" class="inline-block h-8 w-8 mb-4"></i>
                <p class="text-lg font-medium">Error Loading Issues</p>
                <p class="text-sm mt-2">${message}</p>
                <button class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 retry-button">
                    Retry Loading
                </button>
            </div>
        `;
        feather.replace();

        // Add retry handler
        this.element.querySelector('.retry-button').addEventListener('click', () => {
            this.stateManager.updateComponent('endpoints');
        });
    }
    
    /**
     * Render bug list with enhanced error handling
     */
    render(data) {
        try {
            if (!data || !data.items) {
                this.showEmptyState();
                return;
            }
            
            const endpoints = data.items;
            const issues = this.findIssues(endpoints);
            
            if (issues.length === 0) {
                this.showEmptyState();
                return;
            }
            
            const html = this.generateIssuesHtml(issues);
            this.element.innerHTML = html;
            
            // Initialize feather icons and add event listeners
            feather.replace();
            this.addEventListeners();
            
        } catch (error) {
            console.error('Error rendering bug list:', error);
            this.showError('Error rendering bug list');
        }
    }

    /**
     * Show empty state
     */
    showEmptyState() {
        this.element.innerHTML = `
            <div class="text-gray-500 text-center py-8">
                <i data-feather="check-circle" class="inline-block h-12 w-12 mb-4 text-green-500"></i>
                <p class="text-lg font-medium">No Issues Found</p>
                <p class="text-sm mt-2">All endpoints are functioning as expected</p>
            </div>
        `;
        feather.replace();
    }

    /**
     * Find issues in endpoints data
     */
    findIssues(endpoints) {
        return endpoints.filter(endpoint => {
            const statusCodes = endpoint.status_codes || {};
            const hasCriticalError = Object.keys(statusCodes).some(code => parseInt(code) >= 500);
            return hasCriticalError || endpoint.success_rate < 100;
        }).sort((a, b) => {
            // Sort by severity (500+ errors first, then by success rate)
            const aHasCritical = Object.keys(a.status_codes || {}).some(code => parseInt(code) >= 500);
            const bHasCritical = Object.keys(b.status_codes || {}).some(code => parseInt(code) >= 500);
            if (aHasCritical !== bHasCritical) return bHasCritical ? 1 : -1;
            return a.success_rate - b.success_rate;
        });
    }

    /**
     * Generate HTML for issues
     */
    generateIssuesHtml(issues) {
        return `
            <div class="space-y-4">
                ${issues.map(issue => this.generateIssueItemHtml(issue)).join('')}
            </div>
        `;
    }

    /**
     * Generate HTML for a single issue
     */
    generateIssueItemHtml(issue) {
        const statusCodes = issue.status_codes || {};
        const hasCriticalError = Object.keys(statusCodes).some(code => parseInt(code) >= 500);
        const severity = hasCriticalError ? 'critical' : issue.success_rate === 0 ? 'high' : 'medium';
        
        const severityClasses = {
            critical: 'border-red-500 bg-red-50',
            high: 'border-orange-500 bg-orange-50',
            medium: 'border-yellow-500 bg-yellow-50'
        };

        const severityLabels = {
            critical: 'Critical Issue',
            high: 'High Severity',
            medium: 'Medium Severity'
        };

        return `
            <div class="bug-item border-l-4 ${severityClasses[severity]} p-4">
                <div class="flex justify-between items-start">
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <span class="px-2 py-1 rounded text-xs font-medium ${this.getMethodClass(issue.method)}">
                                ${issue.method}
                            </span>
                            <span class="font-mono text-sm">${issue.path}</span>
                        </div>
                        <div class="flex items-center space-x-2 text-sm">
                            <span class="font-medium ${severity === 'critical' ? 'text-red-600' : severity === 'high' ? 'text-orange-600' : 'text-yellow-600'}">
                                ${severityLabels[severity]}
                            </span>
                            <span class="text-gray-500">•</span>
                            <span class="text-gray-600">
                                ${issue.success_rate}% success rate
                            </span>
                            <span class="text-gray-500">•</span>
                            <span class="text-gray-600">
                                ${issue.total_requests} requests
                            </span>
                        </div>
                    </div>
                    <button class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 show-details">
                        <span>Show Details</span>
                        <i data-feather="chevron-down" class="h-4 w-4"></i>
                    </button>
                </div>
                <div class="issue-details hidden mt-4 space-y-3">
                    ${this.generateStatusCodesHtml(statusCodes)}
                    ${issue.response_data ? this.generateResponseDataHtml(issue.response_data) : ''}
                </div>
            </div>
        `;
    }

    /**
     * Generate HTML for status codes
     */
    generateStatusCodesHtml(statusCodes) {
        const codes = Object.entries(statusCodes);
        if (codes.length === 0) return '';
        
        return `
            <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">Status Code Distribution</h4>
                <div class="flex flex-wrap gap-2">
                    ${codes.map(([code, count]) => {
                        const severity = this.getStatusSeverity(code);
                        return `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${severity.classes}">
                                ${code} (${count})
                            </span>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate HTML for response data
     */
    generateResponseDataHtml(responseData) {
        try {
            const formattedData = typeof responseData === 'string' ? 
                responseData : JSON.stringify(responseData, null, 2);
            
            return `
                <div>
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Response Data</h4>
                    <pre class="text-xs bg-gray-50 p-3 rounded overflow-x-auto">${this.escapeHtml(formattedData)}</pre>
                </div>
            `;
        } catch (error) {
            console.error('Error formatting response data:', error);
            return '';
        }
    }

    /**
     * Get status code severity classes
     */
    getStatusSeverity(code) {
        const numCode = parseInt(code);
        if (numCode >= 500) {
            return { classes: 'bg-red-100 text-red-800' };
        }
        if (numCode === 401 || numCode === 403) {
            return { classes: 'bg-orange-100 text-orange-800' };
        }
        if (numCode >= 400) {
            return { classes: 'bg-yellow-100 text-yellow-800' };
        }
        if (numCode === 404) {
            return { classes: 'bg-blue-100 text-blue-800' };
        }
        if (numCode >= 300) {
            return { classes: 'bg-gray-100 text-gray-800' };
        }
        return { classes: 'bg-green-100 text-green-800' };
    }

    /**
     * Get method-specific classes
     */
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

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Add event listeners
     */
    addEventListeners() {
        // Details expansion
        const detailButtons = this.element.querySelectorAll('.show-details');
        detailButtons.forEach(button => {
            button.addEventListener('click', () => {
                const issueItem = button.closest('.bug-item');
                const details = issueItem.querySelector('.issue-details');
                const icon = button.querySelector('i[data-feather]');
                
                details.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
                button.querySelector('span').textContent = 
                    details.classList.contains('hidden') ? 'Show Details' : 'Hide Details';
                
                feather.replace();
            });
        });
    }
}

// Export for use in other modules
window.BugList = BugList;
