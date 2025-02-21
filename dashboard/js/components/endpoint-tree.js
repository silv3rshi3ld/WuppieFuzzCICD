/**
 * Endpoint tree component for displaying API endpoints and their coverage
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
        }

        this.container.innerHTML = html;

        // Initialize feather icons
        if (window.feather) feather.replace();

        // Add event listeners
        this.addEventListeners();
    }

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
                </div>
                <div class="endpoint-details hidden mt-4" id="${detailsId}">
                    ${this.renderEndpointDetails(endpoint)}
                </div>
            </div>
        `;
    }

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
                    </div>
                </div>
            </div>
        `;
    }

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
                </div>
            </div>
        `;
    }

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
    }
}

// Export for use in other modules
window.EndpointTreeComponent = EndpointTreeComponent;
