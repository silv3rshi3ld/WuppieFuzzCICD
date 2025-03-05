/**
 * Enhanced endpoint tree component for displaying API endpoints
 * with support for progressive loading and error handling
 */
class EndpointTree {
    constructor(elementId, stateManager) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.error(`Element with id '${elementId}' not found`);
            return;
        }
        this.stateManager = stateManager;
        this.loadingChunk = false;
        
        // Subscribe to both data and loading state changes
        this.stateManager.subscribe('endpoints', (data) => this.render(data));
        this.stateManager.subscribe('loadingState', (state) => this.handleLoadingState(state));
        
        // Initialize intersection observer for infinite loading
        this.initializeInfiniteLoading();
    }
    
    /**
     * Handle loading state changes
     */
    handleLoadingState(state) {
        const loadingStatus = document.getElementById('endpointLoadingStatus');
        const loadMoreButton = document.getElementById('loadMoreEndpoints');
        
        if (state.loading && state.components.includes('endpoints')) {
            // Show loading state
            this.showLoadingState();
            if (loadingStatus) {
                loadingStatus.classList.remove('hidden');
                loadingStatus.querySelector('#currentChunk').textContent = 
                    state.endpointState.currentChunk + 1;
            }
        } else {
            // Hide loading state
            this.hideLoadingState();
            if (loadingStatus) {
                loadingStatus.classList.add('hidden');
            }
        }

        // Show/hide load more button based on available chunks
        if (loadMoreButton) {
            loadMoreButton.classList.toggle('hidden', !state.endpointState.hasMore);
        }

        // Show error if present
        if (state.errors.endpoints) {
            this.showError(state.errors.endpoints.message, true);
        }
    }

    /**
     * Initialize infinite loading
     */
    initializeInfiniteLoading() {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loadingChunk) {
                    this.loadingChunk = true;
                    this.stateManager.loadNextEndpointChunk().finally(() => {
                        this.loadingChunk = false;
                    });
                }
            });
        }, options);

        // Observe the load more button
        const loadMoreButton = document.getElementById('loadMoreEndpoints');
        if (loadMoreButton) {
            observer.observe(loadMoreButton);
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const loadingOverlay = this.element.querySelector('.loading-overlay') || 
                             this.createLoadingOverlay();
        
        if (!this.element.contains(loadingOverlay)) {
            this.element.appendChild(loadingOverlay);
        }
        loadingOverlay.classList.remove('hidden');
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        const loadingOverlay = this.element.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    /**
     * Create loading overlay
     */
    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay hidden fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center';
        overlay.innerHTML = `
            <div class="text-center">
                <i data-feather="loader" class="h-8 w-8 text-blue-500 animate-spin"></i>
                <p class="mt-2 text-sm text-gray-600">Loading endpoints...</p>
            </div>
        `;
        feather.replace(overlay.querySelector('[data-feather]'));
        return overlay;
    }
    
    render(data) {
        try {
            if (!data || !data.items || !Array.isArray(data.items)) {
                this.showError('Invalid endpoint data received');
                return;
            }

            if (data.items.length === 0 && !data.hasMore) {
                this.showEmptyState();
                return;
            }

            // Add severity legend
            const legendHtml = this.generateLegendHtml();
            
            // Group endpoints by path
            const endpoints = data.items;
            const groupedEndpoints = this.groupEndpoints(endpoints);
            const endpointsHtml = this.generateEndpointTreeHtml(groupedEndpoints);
            
            this.element.innerHTML = `
                ${legendHtml}
                <div class="endpoint-list">
                    ${endpointsHtml}
                </div>
                ${data.hasMore ? `
                    <div id="loadMoreEndpoints" class="text-center mt-4">
                        <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
                            Load More Endpoints
                        </button>
                    </div>
                ` : ''}
            `;
            
            // Initialize feather icons and add event listeners
            feather.replace();
            this.addEventListeners();
            
        } catch (error) {
            console.error('Error rendering endpoint tree:', error);
            this.showError('Error rendering endpoint tree', true);
        }
    }

    generateLegendHtml() {
        return `
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                <h3 class="font-medium text-gray-700 mb-2">Response Status Severity</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div class="flex items-center">
                        <span class="w-3 h-3 bg-red-500 rounded mr-2"></span>
                        <span class="text-sm">Critical (5xx)</span>
                    </div>
                    <div class="flex items-center">
                        <span class="w-3 h-3 bg-orange-500 rounded mr-2"></span>
                        <span class="text-sm">Medium-High (401/403)</span>
                    </div>
                    <div class="flex items-center">
                        <span class="w-3 h-3 bg-yellow-500 rounded mr-2"></span>
                        <span class="text-sm">Medium (400)</span>
                    </div>
                    <div class="flex items-center">
                        <span class="w-3 h-3 bg-blue-500 rounded mr-2"></span>
                        <span class="text-sm">Low (404)</span>
                    </div>
                    <div class="flex items-center">
                        <span class="w-3 h-3 bg-gray-500 rounded mr-2"></span>
                        <span class="text-sm">Info (3xx)</span>
                    </div>
                    <div class="flex items-center">
                        <span class="w-3 h-3 bg-green-500 rounded mr-2"></span>
                        <span class="text-sm">Success (2xx)</span>
                    </div>
                </div>
            </div>
        `;
    }

    showError(message, showRetry = false) {
        this.element.innerHTML = `
            <div class="text-red-500 text-center py-8">
                <i data-feather="alert-triangle" class="inline-block h-8 w-8 mb-4"></i>
                <p class="text-lg font-medium">${message}</p>
                ${showRetry ? `
                    <button class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 retry-button">
                        Retry Loading
                    </button>
                ` : ''}
            </div>
        `;
        feather.replace();

        // Add retry handler
        if (showRetry) {
            this.element.querySelector('.retry-button').addEventListener('click', () => {
                this.stateManager.updateComponent('endpoints');
            });
        }
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
        const groups = {};
        endpoints.forEach(endpoint => {
            const path = endpoint.path || '';
            if (!groups[path]) {
                groups[path] = [];
            }
            groups[path].push(endpoint);
        });
        return groups;
    }

    getSeverityInfo(statusCode) {
        const code = parseInt(statusCode);
        if (code >= 500) {
            return { level: 'Critical', color: 'red', icon: 'alert-octagon' };
        }
        if (code === 401 || code === 403) {
            return { level: 'Medium-High', color: 'orange', icon: 'alert-triangle' };
        }
        if (code >= 400) {
            return { level: 'Medium', color: 'yellow', icon: 'alert-circle' };
        }
        if (code === 404) {
            return { level: 'Low', color: 'blue', icon: 'info' };
        }
        if (code >= 300) {
            return { level: 'Info', color: 'gray', icon: 'help-circle' };
        }
        return { level: 'Success', color: 'green', icon: 'check-circle' };
    }

    generateEndpointTreeHtml(groupedEndpoints) {
        return Object.entries(groupedEndpoints).map(([path, endpoints]) => {
            // Get the highest severity for this endpoint group
            const highestSeverity = this.getHighestSeverity(endpoints);
            const severityInfo = this.getSeverityInfo(highestSeverity);
            
            return `
                <div class="endpoint-group mb-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div class="endpoint-header p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100">
                        <div class="flex items-center space-x-3">
                            <i data-feather="chevron-right" class="transform transition-transform h-4 w-4"></i>
                            <span class="font-mono text-sm">${this.escapeHtml(path)}</span>
                            <span class="bg-${severityInfo.color}-100 text-${severityInfo.color}-800 text-xs px-2 py-1 rounded-full">
                                ${severityInfo.level}
                            </span>
                        </div>
                        <div class="text-sm text-gray-500">
                            ${endpoints.length} method${endpoints.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                    <div class="endpoint-methods hidden">
                        ${endpoints.map(endpoint => this.generateMethodHtml(endpoint)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    getHighestSeverity(endpoints) {
        let highestCode = 200;
        endpoints.forEach(endpoint => {
            const statusCodes = endpoint.status_codes || {};
            Object.keys(statusCodes).forEach(code => {
                const numCode = parseInt(code);
                if (numCode > highestCode) {
                    highestCode = numCode;
                }
            });
        });
        return highestCode;
    }

    generateMethodHtml(endpoint) {
        const method = endpoint.method || 'GET';
        const statusCodes = endpoint.status_codes || {};
        const methodClass = this.getMethodClass(method);
        
        // Get the highest severity status code
        const highestSeverity = Math.max(...Object.keys(statusCodes).map(code => parseInt(code)));
        const severityInfo = this.getSeverityInfo(highestSeverity);
        
        return `
            <div class="border-t border-gray-200">
                <div class="p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-3">
                            <span class="px-2 py-1 rounded text-xs font-medium ${methodClass}">
                                ${method}
                            </span>
                            <span class="text-sm text-gray-600">
                                ${endpoint.total_requests || 0} requests
                            </span>
                        </div>
                        <button class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 show-details">
                            <span>Show Details</span>
                            <i data-feather="chevron-down" class="h-4 w-4"></i>
                        </button>
                    </div>
                    <div class="method-details hidden">
                        <div class="space-y-2">
                            ${this.generateStatusCodesHtml(statusCodes)}
                            ${endpoint.response_data ? this.generateResponseDataHtml(endpoint.response_data) : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateStatusCodesHtml(statusCodes) {
        const codes = Object.entries(statusCodes);
        if (codes.length === 0) return '';
        
        return `
            <div class="mt-2">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Status Codes</h4>
                <div class="flex flex-wrap gap-2">
                    ${codes.map(([code, count]) => {
                        const severity = this.getSeverityInfo(code);
                        return `
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${severity.color}-100 text-${severity.color}-800">
                                ${code} (${count})
                            </span>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    generateResponseDataHtml(responseData) {
        try {
            const formattedData = typeof responseData === 'string' ? 
                responseData : JSON.stringify(responseData, null, 2);
            
            return `
                <div class="mt-3">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Response Data</h4>
                    <pre class="text-xs bg-gray-50 p-3 rounded overflow-x-auto">${this.escapeHtml(formattedData)}</pre>
                </div>
            `;
        } catch (error) {
            console.error('Error formatting response data:', error);
            return '';
        }
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
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    addEventListeners() {
        // Endpoint group expansion
        const headers = this.element.querySelectorAll('.endpoint-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const group = header.closest('.endpoint-group');
                const methods = group.querySelector('.endpoint-methods');
                const icon = header.querySelector('i[data-feather]');
                
                methods.classList.toggle('hidden');
                icon.classList.toggle('rotate-90');
            });
        });

        // Method details expansion
        const detailButtons = this.element.querySelectorAll('.show-details');
        detailButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const methodContainer = button.closest('div').parentElement;
                const details = methodContainer.querySelector('.method-details');
                const icon = button.querySelector('i[data-feather]');
                
                details.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
                button.querySelector('span').textContent = 
                    details.classList.contains('hidden') ? 'Show Details' : 'Hide Details';
            });
        });

        // Load more button
        const loadMoreButton = document.getElementById('loadMoreEndpoints');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                if (!this.loadingChunk) {
                    this.loadingChunk = true;
                    this.stateManager.loadNextEndpointChunk().finally(() => {
                        this.loadingChunk = false;
                    });
                }
            });
        }

        feather.replace();
    }
}

// Export for use in other modules
window.EndpointTree = EndpointTree;
