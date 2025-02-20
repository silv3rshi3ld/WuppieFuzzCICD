/**
 * Endpoint tree component for displaying API endpoints
 */
class EndpointTree {
    constructor(elementId, stateManager) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.error(`Element with id '${elementId}' not found`);
            return;
        }
        this.stateManager = stateManager;
        this.stateManager.subscribe('endpoints', (data) => this.render(data));
    }
    
    render(data) {
        try {
            if (!data || typeof data !== 'object') {
                this.showError('Invalid endpoint data received');
                return;
            }

            if (!data.items || !Array.isArray(data.items)) {
                this.showError('No endpoint data available');
                return;
            }

            if (data.items.length === 0) {
                this.showEmptyState();
                return;
            }
            
            const endpoints = data.items;
            const groupedEndpoints = this.groupEndpoints(endpoints);
            const html = this.generateHtml(groupedEndpoints);
            this.element.innerHTML = html;
            
            // Add click handlers for expandable sections
            this.addEventListeners();
            
        } catch (error) {
            console.error('Error rendering endpoint tree:', error);
            this.showError('Error rendering endpoint tree');
        }
    }

    showError(message) {
        this.element.innerHTML = `
            <div class="text-red-500 text-center py-4">
                <i data-feather="alert-triangle" class="inline-block h-5 w-5 mr-2"></i>
                ${message}
            </div>
        `;
        feather.replace();
    }

    showEmptyState() {
        this.element.innerHTML = `
            <div class="text-gray-500 text-center py-8">
                <i data-feather="inbox" class="inline-block h-12 w-12 mb-4 text-gray-400"></i>
                <p class="text-lg font-medium">No endpoints found</p>
                <p class="text-sm mt-2">Try adjusting your filters or search criteria</p>
            </div>
        `;
        feather.replace();
    }

    groupEndpoints(endpoints) {
        try {
            const groups = {};
            endpoints.forEach(endpoint => {
                if (!this.validateEndpoint(endpoint)) {
                    console.error('Invalid endpoint:', endpoint);
                    return;
                }
                const path = endpoint.path;
                if (!groups[path]) {
                    groups[path] = [];
                }
                groups[path].push(endpoint);
            });
            return groups;
        } catch (error) {
            console.error('Error grouping endpoints:', error);
            return {};
        }
    }

    validateEndpoint(endpoint) {
        return (
            endpoint &&
            typeof endpoint === 'object' &&
            typeof endpoint.path === 'string' &&
            typeof endpoint.method === 'string' &&
            typeof endpoint.total_requests === 'number' &&
            typeof endpoint.success_rate === 'number' &&
            typeof endpoint.type === 'string'
        );
    }

    generateHtml(groupedEndpoints) {
        try {
            return Object.entries(groupedEndpoints).map(([path, methods]) => `
                <div class="endpoint-group mb-4">
                    <div class="endpoint-path px-4 py-2 bg-gray-50 font-mono text-sm border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                        <i data-feather="chevron-right" class="inline-block h-4 w-4 mr-2 transform transition-transform"></i>
                        ${this.escapeHtml(path)}
                        <span class="text-gray-500 text-xs ml-2">${methods.length} method${methods.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="endpoint-methods p-4 space-y-2 hidden">
                        ${methods.map(method => this.generateMethodHtml(method)).join('')}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error generating HTML:', error);
            return '';
        }
    }

    generateMethodHtml(method) {
        try {
            const statusClass = this.getStatusClass(method.success_rate);
            const methodClass = this.getMethodClass(method.method);
            return `
                <div class="endpoint-method ${method.type} flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <div class="flex items-center space-x-4">
                        <span class="method-badge ${methodClass} px-2 py-1 rounded text-xs font-medium">
                            ${method.method}
                        </span>
                        <span class="text-sm text-gray-600">
                            ${method.total_requests} requests
                        </span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium ${statusClass}">
                            ${method.success_rate}% success
                        </span>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error generating method HTML:', error);
            return '';
        }
    }

    getStatusClass(successRate) {
        if (successRate >= 90) return 'text-green-600';
        if (successRate >= 75) return 'text-yellow-600';
        return 'text-red-600';
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

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    addEventListeners() {
        try {
            const pathElements = this.element.querySelectorAll('.endpoint-path');
            pathElements.forEach(el => {
                el.addEventListener('click', () => {
                    const methodsContainer = el.nextElementSibling;
                    const icon = el.querySelector('i[data-feather]');
                    
                    if (methodsContainer.classList.contains('hidden')) {
                        methodsContainer.classList.remove('hidden');
                        icon.classList.add('rotate-90');
                    } else {
                        methodsContainer.classList.add('hidden');
                        icon.classList.remove('rotate-90');
                    }
                });
            });
            feather.replace();
        } catch (error) {
            console.error('Error adding event listeners:', error);
        }
    }
}

// Export for use in other modules
window.EndpointTree = EndpointTree;
