/**
<<<<<<< Updated upstream
 * Endpoint tree component for displaying API endpoints and their coverage
=======
 * Enhanced endpoint tree component for displaying API endpoints
 * with improved error handling, loading states, and details display
>>>>>>> Stashed changes
 */
class EndpointTreeComponent {
    constructor() {
        this.container = document.getElementById('endpointTree');
        this.endpoints = [];
        this.currentPage = 1;
        this.endpointsPerPage = 10;
        this.filters = {
            hits: true,
            misses: true
        };
    }

    createEndpointTree(endpoints) {
        if (!this.container) return;
        this.endpoints = endpoints || [];
        this.renderEndpointTree();
    }

    renderEndpointTree() {
        if (!this.container) return;

        if (this.endpoints.length === 0) {
            this.container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i data-feather="activity" class="w-12 h-12 mx-auto mb-4"></i>
                    <p>No endpoints found</p>
                </div>
            `;
            if (window.feather) feather.replace();
            return;
        }
<<<<<<< Updated upstream

        // Filter endpoints based on current filters
        const filteredEndpoints = this.endpoints.filter(endpoint => {
            const isHit = endpoint.success_requests > 0;
            return (isHit && this.filters.hits) || (!isHit && this.filters.misses);
        });

        // Sort endpoints by path
        filteredEndpoints.sort((a, b) => a.path.localeCompare(b.path));

        // Paginate endpoints
        const startIndex = (this.currentPage - 1) * this.endpointsPerPage;
        const endIndex = startIndex + this.endpointsPerPage;
        const currentEndpoints = filteredEndpoints.slice(startIndex, endIndex);

        let html = `
            <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-4">
                    <label class="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            ${this.filters.hits ? 'checked' : ''}
                            data-filter="hits"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        >
                        <span class="text-green-600">Hits</span>
                    </label>
                    <label class="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            ${this.filters.misses ? 'checked' : ''}
                            data-filter="misses"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        >
                        <span class="text-red-600">Misses</span>
                    </label>
                </div>
                <div class="text-sm text-gray-500">
                    ${filteredEndpoints.length} endpoints
                </div>
            </div>
            <div class="space-y-4">
                ${currentEndpoints.map(endpoint => this.renderEndpointCard(endpoint)).join('')}
            </div>
        `;

        // Add pagination if needed
        if (filteredEndpoints.length > this.endpointsPerPage) {
            html += this.renderPagination(filteredEndpoints.length);
=======
        
        this.stateManager = stateManager;
        this.loadingState = false;
        this.searchDebounceTimeout = null;
        
        // Create wrapper for loading state
        this.createWrapper();
        
        // Subscribe to data updates
        this.stateManager.subscribe('endpoints', data => this.render(data));
        this.stateManager.subscribe('loading', loading => this.setLoading(loading));
        this.stateManager.subscribe('error', error => this.handleError(error));
    }

    createWrapper() {
        // Create wrapper for loading overlay
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'endpoint-tree-wrapper relative';
        this.element.parentNode.insertBefore(this.wrapper, this.element);
        this.wrapper.appendChild(this.element);

        // Create loading overlay
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.className = 'loading-overlay hidden absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center';
        this.loadingOverlay.innerHTML = `
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        `;
        this.wrapper.appendChild(this.loadingOverlay);

        // Create search input
        this.createSearchInput();
    }

    createSearchInput() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'mb-4';
        searchContainer.innerHTML = `
            <div class="relative">
                <input type="text" 
                       class="search-input w-full px-4 py-2 border rounded-lg"
                       placeholder="Search endpoints..."
                >
                <i data-feather="search" 
                   class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                </i>
            </div>
        `;

        this.element.parentNode.insertBefore(searchContainer, this.element);
        
        // Initialize search functionality
        const searchInput = searchContainer.querySelector('.search-input');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Initialize icons
        feather.replace();
    }

    handleSearch(query) {
        clearTimeout(this.searchDebounceTimeout);
        this.searchDebounceTimeout = setTimeout(() => {
            this.stateManager.setSearchQuery(query);
        }, 300);
    }

    setLoading(loading) {
        this.loadingState = loading;
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.toggle('hidden', !loading);
        }
    }

    handleError(error) {
        if (error.component === 'endpoints') {
            this.showError(error.message);
        }
    }

    render(data) {
        try {
            if (!data || !data.items || !Array.isArray(data.items)) {
                this.showError('Invalid endpoint data received');
                return;
            }

            if (data.items.length === 0) {
                this.showEmptyState();
                return;
            }

            // Group endpoints by path
            const groupedEndpoints = this.groupEndpoints(data.items);
            
            // Generate HTTP methods legend
            const legendHtml = this.generateLegend();
            
            // Generate endpoint tree HTML
            const endpointsHtml = this.generateEndpointTree(groupedEndpoints);

            // Update the element content
            this.element.innerHTML = `
                ${legendHtml}
                <div class="space-y-4">
                    ${endpointsHtml}
                </div>
            `;

            // Initialize icons and add event listeners
            feather.replace();
            this.addEventListeners();
            
        } catch (error) {
            console.error('Error rendering endpoint tree:', error);
            this.showError('Error rendering endpoint tree');
>>>>>>> Stashed changes
        }

        this.container.innerHTML = html;

        // Initialize feather icons
        if (window.feather) feather.replace();

        // Add event listeners
        this.addEventListeners();
    }

<<<<<<< Updated upstream
    renderEndpointCard(endpoint) {
        const successRate = endpoint.success_rate;
        const successClass = successRate >= 80 ? 'bg-green-50 border-green-200' :
                           successRate >= 50 ? 'bg-yellow-50 border-yellow-200' :
                           'bg-red-50 border-red-200';

        const detailsId = `endpoint-${this.slugify(endpoint.path)}`;

        return `
            <div class="endpoint-card ${successClass} border rounded-lg p-4">
                <div class="flex items-start justify-between cursor-pointer" data-toggle-details="${detailsId}">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="font-medium">${endpoint.method}</span>
                            <span class="text-gray-600">${endpoint.path}</span>
                        </div>
                        <div class="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span class="text-gray-500">Total Requests:</span>
                                <span class="font-medium">${endpoint.total_requests}</span>
                            </div>
                            <div>
                                <span class="text-gray-500">Success Rate:</span>
                                <span class="font-medium">${endpoint.success_rate}%</span>
                            </div>
                            <div>
                                <span class="text-gray-500">Success/Total:</span>
                                <span class="font-medium">${endpoint.success_requests}/${endpoint.total_requests}</span>
                            </div>
                        </div>
                    </div>
                    <button class="text-gray-400 hover:text-gray-600">
                        <i data-feather="chevron-down"></i>
                    </button>
=======
    generateLegend() {
        return `
            <div class="mb-6">
                <h3 class="text-sm font-medium text-gray-700 mb-2">HTTP Methods</h3>
                <div class="flex flex-wrap gap-2">
                    <span class="method-badge get">GET</span>
                    <span class="method-badge post">POST</span>
                    <span class="method-badge put">PUT</span>
                    <span class="method-badge delete">DELETE</span>
                    <span class="method-badge patch">PATCH</span>
                </div>
            </div>
        `;
    }

    generateEndpointTree(groupedEndpoints) {
        return Object.entries(groupedEndpoints).map(([path, endpoints]) => {
            const totalMethods = endpoints.length;
            const successRate = this.calculateSuccessRate(endpoints);
            
            return `
                <div class="endpoint-group mb-4">
                    <div class="card">
                        <div class="endpoint-header p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100">
                            <div class="flex items-center gap-3">
                                <i data-feather="chevron-right" class="h-4 w-4 transform transition-transform"></i>
                                <div>
                                    <div class="font-mono text-sm">${this.escapeHtml(path)}</div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        ${totalMethods} method${totalMethods !== 1 ? 's' : ''} | 
                                        Success Rate: ${successRate}%
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="endpoint-methods hidden divide-y divide-gray-200">
                            ${endpoints.map(endpoint => this.generateMethodHtml(endpoint)).join('')}
                        </div>
                    </div>
>>>>>>> Stashed changes
                </div>
                <div class="endpoint-details hidden mt-4" id="${detailsId}">
                    ${this.renderEndpointDetails(endpoint)}
                </div>
            </div>
        `;
    }

<<<<<<< Updated upstream
    renderEndpointDetails(endpoint) {
        return `
            <div class="space-y-4">
                <div>
                    <h4 class="text-sm font-medium mb-2">Status Code Distribution</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        ${Object.entries(endpoint.status_codes).map(([code, count]) => `
                            <div class="text-sm">
                                <span class="text-gray-500">Status ${code}:</span>
                                <span class="font-medium">${count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div>
                    <h4 class="text-sm font-medium mb-2">Response Examples</h4>
                    <div class="space-y-2">
                        ${Object.entries(endpoint.status_codes).map(([code]) => {
                            const response = endpoint.responses?.[code];
                            if (!response) return '';
                            return `
                                <div class="bg-gray-50 p-3 rounded">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-sm font-medium">Status ${code}</span>
                                        <span class="text-xs px-2 py-1 rounded ${
                                            code.startsWith('2') ? 'bg-green-100 text-green-800' :
                                            code.startsWith('4') ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }">${
                                            code.startsWith('2') ? 'Success' :
                                            code.startsWith('4') ? 'Client Error' :
                                            'Server Error'
                                        }</span>
                                    </div>
                                    <pre class="text-sm bg-white p-2 rounded overflow-x-auto">${
                                        this.formatResponse(response)
                                    }</pre>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div>
                    <h4 class="text-sm font-medium mb-2">Severity Distribution</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        ${Object.entries(endpoint.severity_counts || {}).map(([severity, count]) => `
                            <div class="text-sm">
                                <span class="text-gray-500">${severity}:</span>
                                <span class="font-medium">${count}</span>
                            </div>
                        `).join('')}
=======
    calculateSuccessRate(endpoints) {
        const successful = endpoints.filter(e => (e.status_code || 0) < 400).length;
        return ((successful / endpoints.length) * 100).toFixed(1);
    }

    generateMethodHtml(endpoint) {
        const method = endpoint.http_method || 'GET';
        const statusCode = endpoint.status_code || 200;
        const severity = this.getSeverityInfo(statusCode);
        
        return `
            <div class="p-4">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <span class="method-badge ${method.toLowerCase()}">${method}</span>
                        <span class="text-sm text-gray-600">Status: ${statusCode}</span>
                        <span class="bg-${severity.color}-100 text-${severity.color}-800 text-xs px-2 py-1 rounded-full">
                            ${severity.level}
                        </span>
>>>>>>> Stashed changes
                    </div>
                    <button class="button button-secondary text-sm show-details">
                        <span>Show Details</span>
                        <i data-feather="chevron-down" class="h-4 w-4 ml-1"></i>
                    </button>
                </div>
                <div class="method-details hidden space-y-4">
                    ${this.generateDetailsSection(endpoint)}
                </div>
            </div>
        `;
    }

<<<<<<< Updated upstream
    renderPagination(totalEndpoints) {
        const totalPages = Math.ceil(totalEndpoints / this.endpointsPerPage);
        return `
            <div class="flex items-center justify-between mt-6">
                <div class="text-sm text-gray-500">
                    Showing ${(this.currentPage - 1) * this.endpointsPerPage + 1} to ${Math.min(this.currentPage * this.endpointsPerPage, totalEndpoints)}
                    of ${totalEndpoints} endpoints
                </div>
                <div class="flex items-center gap-2">
                    <button 
                        class="pagination-prev px-3 py-1 rounded border ${this.currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}"
                        ${this.currentPage === 1 ? 'disabled' : ''}
                    >
                        Previous
                    </button>
                    <button 
                        class="pagination-next px-3 py-1 rounded border ${this.currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}"
                        ${this.currentPage === totalPages ? 'disabled' : ''}
                    >
                        Next
                    </button>
=======
    generateDetailsSection(endpoint) {
        const sections = [];

        if (endpoint.request_details) {
            sections.push(this.generateDataSection('Request Details', endpoint.request_details));
        }

        if (endpoint.response_data) {
            sections.push(this.generateDataSection('Response Details', endpoint.response_data));
        }

        // Add performance metrics if available
        if (endpoint.average_response_time) {
            sections.push(`
                <div class="metrics-container">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">Performance Metrics</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-gray-50 p-3 rounded">
                            <div class="text-xs text-gray-500">Avg Response Time</div>
                            <div class="text-sm font-medium">${endpoint.average_response_time}ms</div>
                        </div>
                        <div class="bg-gray-50 p-3 rounded">
                            <div class="text-xs text-gray-500">Success Rate</div>
                            <div class="text-sm font-medium">${endpoint.success_rate || 0}%</div>
                        </div>
                    </div>
>>>>>>> Stashed changes
                </div>
            `);
        }

        return sections.join('');
    }

<<<<<<< Updated upstream
    addEventListeners() {
        // Add filter listeners
        const filterInputs = this.container.querySelectorAll('[data-filter]');
        filterInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const type = e.target.dataset.filter;
                this.filters[type] = e.target.checked;
                this.currentPage = 1;
                this.renderEndpointTree();
            });
        });

        // Add pagination listeners
        const prevButton = this.container.querySelector('.pagination-prev');
        const nextButton = this.container.querySelector('.pagination-next');
        if (prevButton) {
            prevButton.addEventListener('click', () => this.changePage(this.currentPage - 1));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => this.changePage(this.currentPage + 1));
        }

        // Add endpoint details toggle listeners
        const toggleHeaders = this.container.querySelectorAll('[data-toggle-details]');
        toggleHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const detailsId = header.dataset.toggleDetails;
                const details = document.getElementById(detailsId);
                if (details) {
                    details.classList.toggle('hidden');
                    const icon = header.querySelector('i');
                    if (icon) {
                        icon.setAttribute(
                            'data-feather',
                            details.classList.contains('hidden') ? 'chevron-down' : 'chevron-up'
                        );
                        if (window.feather) feather.replace();
                    }
                }
            });
        });
    }

    changePage(newPage) {
        const totalPages = Math.ceil(this.endpoints.length / this.endpointsPerPage);
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderEndpointTree();
        }
    }

    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    formatResponse(response) {
        if (!response) return '';
        try {
            // Try to parse and prettify JSON
            if (typeof response === 'string') {
                const parsed = JSON.parse(response);
                return JSON.stringify(parsed, null, 2);
            } else if (typeof response === 'object') {
                return JSON.stringify(response, null, 2);
            }
            return response;
        } catch (e) {
            // If not JSON, return as-is with HTML escaping
            return response
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
=======
    generateDataSection(title, data) {
        try {
            const formattedData = typeof data === 'string' ? 
                data : JSON.stringify(data, null, 2);
            
            return `
                <div class="data-container">
                    <div class="data-header flex justify-between items-center mb-2">
                        <h4 class="text-sm font-medium text-gray-700">${title}</h4>
                        <button class="copy-button p-1 hover:bg-gray-100 rounded" data-clipboard-text="${this.escapeHtml(formattedData)}">
                            <i data-feather="copy" class="h-4 w-4"></i>
                        </button>
                    </div>
                    <div class="data-content">
                        <pre class="text-xs bg-gray-50 p-3 rounded overflow-x-auto"><code class="json">${this.formatJson(formattedData)}</code></pre>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(`Error formatting ${title.toLowerCase()}:`, error);
            return '';
        }
    }

    getSeverityInfo(statusCode) {
        const code = parseInt(statusCode);
        
        // Order matters: check specific codes first, then ranges
        if (code === 404) {
            return { level: 'Not Found', color: 'blue' };
        }
        if (code >= 500) {
            return { level: 'Critical', color: 'red' };
        }
        if (code === 401 || code === 403) {
            return { level: 'Auth Error', color: 'orange' };
        }
        if (code >= 400) {
            return { level: 'Client Error', color: 'yellow' };
        }
        if (code >= 300) {
            return { level: 'Redirect', color: 'gray' };
        }
        return { level: 'Success', color: 'green' };
    }

    showError(message) {
        this.element.innerHTML = `
            <div class="text-center py-8">
                <div class="card p-6">
                    <i data-feather="alert-triangle" class="h-12 w-12 text-red-500 mx-auto mb-4"></i>
                    <p class="text-lg font-medium text-gray-900">${message}</p>
                </div>
            </div>
        `;
        feather.replace();
    }

    showEmptyState() {
        this.element.innerHTML = `
            <div class="text-center py-8">
                <div class="card p-6">
                    <i data-feather="inbox" class="h-12 w-12 text-gray-400 mx-auto mb-4"></i>
                    <p class="text-lg font-medium text-gray-900">No endpoints found</p>
                    <p class="text-sm text-gray-600 mt-2">Try adjusting your search criteria</p>
                </div>
            </div>
        `;
        feather.replace();
    }

    groupEndpoints(endpoints) {
        return endpoints.reduce((groups, endpoint) => {
            const path = endpoint.path || '';
            if (!groups[path]) {
                groups[path] = [];
            }
            groups[path].push(endpoint);
            return groups;
        }, {});
    }

    formatJson(json) {
        try {
            const obj = typeof json === 'string' ? JSON.parse(json) : json;
            return this.syntaxHighlight(JSON.stringify(obj, null, 2));
        } catch (e) {
            return this.escapeHtml(json);
        }
    }

    syntaxHighlight(json) {
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
            match => {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return `<span class="${cls}">${this.escapeHtml(match)}</span>`;
            }
        );
    }

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    addEventListeners() {
        // Endpoint group expansion
        this.element.querySelectorAll('.endpoint-header').forEach(header => {
            header.addEventListener('click', () => {
                const group = header.closest('.endpoint-group');
                const methods = group.querySelector('.endpoint-methods');
                const icon = header.querySelector('i[data-feather]');
                
                methods.classList.toggle('hidden');
                if (icon) {
                    icon.classList.toggle('rotate-90');
                    feather.replace();
                }
            });
        });

        // Method details expansion
        this.element.querySelectorAll('.show-details').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const methodContainer = button.closest('div').parentElement;
                const details = methodContainer.querySelector('.method-details');
                const icon = button.querySelector('i[data-feather]');
                const text = button.querySelector('span');
                
                if (details && icon && text) {
                    details.classList.toggle('hidden');
                    icon.classList.toggle('rotate-180');
                    text.textContent = details.classList.contains('hidden') ? 'Show Details' : 'Hide Details';
                    feather.replace();
                }
            });
        });

        // Copy buttons
        this.element.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = button.dataset.clipboardText;
                if (text) {
                    navigator.clipboard.writeText(text).then(() => {
                        const icon = button.querySelector('i');
                        if (icon) {
                            icon.setAttribute('data-feather', 'check');
                            feather.replace();
                            setTimeout(() => {
                                icon.setAttribute('data-feather', 'copy');
                                feather.replace();
                            }, 2000);
                        }
                    });
                }
            });
        });
>>>>>>> Stashed changes
    }
}

// Export for use in other modules
window.EndpointTreeComponent = EndpointTreeComponent;
