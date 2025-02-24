/**
<<<<<<< Updated upstream
 * Bug list component for displaying crashes and issues
=======
 * Enhanced bug list component for displaying and managing found issues
 * with filtering, sorting, and detailed response data
>>>>>>> Stashed changes
 */
class BugListComponent {
    constructor() {
        this.container = document.getElementById('bugList');
        this.bugs = [];
        this.currentPage = 1;
        this.bugsPerPage = 10;
    }

    createBugList(bugs) {
        if (!this.container) return;
        this.bugs = bugs || [];
        this.renderBugList();
    }

    renderBugList() {
        if (!this.container) return;

        if (this.bugs.length === 0) {
            this.container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i data-feather="check-circle" class="w-12 h-12 mx-auto mb-4"></i>
                    <p>No crashes or issues found</p>
                </div>
            `;
            if (window.feather) feather.replace();
            return;
        }

<<<<<<< Updated upstream
        const startIndex = (this.currentPage - 1) * this.bugsPerPage;
        const endIndex = startIndex + this.bugsPerPage;
        const currentBugs = this.bugs.slice(startIndex, endIndex);

        let html = `
            <div class="space-y-4">
                ${currentBugs.map((bug, index) => this.renderBugCard(bug, startIndex + index + 1)).join('')}
            </div>
        `;

        // Add pagination if needed
        if (this.bugs.length > this.bugsPerPage) {
            html += this.renderPagination();
        }

        this.container.innerHTML = html;

        // Initialize feather icons
        if (window.feather) feather.replace();

        // Add event listeners
        this.addEventListeners();
    }

    getSeverityStyles(severity) {
        severity = severity.toLowerCase();
        const styles = {
            critical: {
                card: 'bg-red-50 border-red-200 shadow-red-100',
                badge: 'text-red-700 bg-red-100',
                icon: 'alert-octagon',
                animation: 'animate-pulse'
            },
            high: {
                card: 'bg-orange-50 border-orange-200',
                badge: 'text-orange-700 bg-orange-100',
                icon: 'alert-triangle'
            },
            medium: {
                card: 'bg-yellow-50 border-yellow-200',
                badge: 'text-yellow-700 bg-yellow-100',
                icon: 'alert-circle'
            },
            low: {
                card: 'bg-blue-50 border-blue-200',
                badge: 'text-blue-700 bg-blue-100',
                icon: 'info'
            }
        };
        return styles[severity] || styles.low;
    }

    formatTimestamp(timestamp) {
        if (!timestamp) return 'Unknown';
        return new Date(timestamp).toLocaleString();
    }

    renderBugCard(bug, index) {
        const styles = this.getSeverityStyles(bug.severity);
        const detailsId = `bug-${index}`;
        const occurrences = bug.occurrence_count || 1;

        return `
            <div class="bug-card ${styles.card} border rounded-lg p-4 ${styles.animation || ''}">
                <div class="flex items-start justify-between cursor-pointer" data-toggle-details="${detailsId}">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="flex items-center gap-1 text-sm font-medium ${styles.badge} px-2 py-0.5 rounded">
                                <i data-feather="${styles.icon}" class="w-4 h-4"></i>
                                ${bug.severity.toUpperCase()}
                            </span>
                            <span class="text-sm text-gray-500">Bug #${index}</span>
                            ${occurrences > 1 ? `
                                <span class="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                                    ${occurrences} occurrences
                                </span>
                            ` : ''}
                            <span class="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                ${bug.category}
                            </span>
                        </div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="font-medium">${bug.method}</span>
                            <span class="text-gray-600">${bug.endpoint}</span>
                        </div>
                        <div class="text-sm text-gray-500">
                            Status: ${bug.status_code} | First seen: ${this.formatTimestamp(bug.first_seen)}
                        </div>
                    </div>
                    <button class="text-gray-400 hover:text-gray-600">
                        <i data-feather="chevron-down"></i>
                    </button>
                </div>
                <div class="bug-details hidden mt-4" id="${detailsId}">
                    ${this.renderBugDetails(bug)}
=======
        this.stateManager = stateManager;
        this.filters = {
            severity: new Set(),
            method: new Set(),
            statusCode: new Set()
        };
        this.sortConfig = {
            field: 'timestamp',
            direction: 'desc'
        };

        this.createWrapper();
        
        // Subscribe to data updates
        this.stateManager.subscribe('bugs', data => this.render(data));
        this.stateManager.subscribe('loading', loading => this.setLoading(loading));
        this.stateManager.subscribe('error', error => this.handleError(error));
    }

    createWrapper() {
        // Create wrapper for loading overlay
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'bug-list-wrapper relative';
        this.element.parentNode.insertBefore(this.wrapper, this.element);
        this.wrapper.appendChild(this.element);

        // Create loading overlay
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.className = 'loading-overlay hidden absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center';
        this.loadingOverlay.innerHTML = `
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        `;
        this.wrapper.appendChild(this.loadingOverlay);

        // Create filter controls
        this.createFilterControls();
    }

    createFilterControls() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'mb-4 space-y-4';
        filterContainer.innerHTML = `
            <div class="flex flex-wrap gap-4">
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select class="severity-filter w-full rounded-md border-gray-300">
                        <option value="">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">HTTP Method</label>
                    <select class="method-filter w-full rounded-md border-gray-300">
                        <option value="">All Methods</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </select>
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select class="sort-filter w-full rounded-md border-gray-300">
                        <option value="timestamp">Time</option>
                        <option value="severity">Severity</option>
                        <option value="status_code">Status Code</option>
                    </select>
                </div>
            </div>
        `;

        this.element.parentNode.insertBefore(filterContainer, this.element);
        
        // Add event listeners to filters
        filterContainer.querySelector('.severity-filter').addEventListener('change', (e) => {
            this.updateFilter('severity', e.target.value);
        });
        
        filterContainer.querySelector('.method-filter').addEventListener('change', (e) => {
            this.updateFilter('method', e.target.value);
        });
        
        filterContainer.querySelector('.sort-filter').addEventListener('change', (e) => {
            this.updateSort(e.target.value);
        });
    }

    setLoading(loading) {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.toggle('hidden', !loading);
        }
    }

    handleError(error) {
        if (error.component === 'bugs') {
            this.showError(error.message);
        }
    }

    updateFilter(type, value) {
        this.filters[type] = value ? new Set([value]) : new Set();
        this.stateManager.updateComponent('bugs');
    }

    updateSort(field) {
        this.sortConfig.field = field;
        this.sortConfig.direction = 'desc';
        this.stateManager.updateComponent('bugs');
    }

    render(bugs) {
        try {
            if (!Array.isArray(bugs)) {
                this.showError('Invalid bug data received');
                return;
            }

            if (bugs.length === 0) {
                this.showEmptyState();
                return;
            }

            const filteredBugs = this.filterBugs(bugs);
            const sortedBugs = this.sortBugs(filteredBugs);
            
            this.element.innerHTML = `
                <div class="space-y-4">
                    ${this.generateSummary(filteredBugs)}
                    ${sortedBugs.map(bug => this.generateBugCard(bug)).join('')}
                </div>
            `;

            // Initialize icons and add event listeners
            feather.replace();
            this.addEventListeners();
            
        } catch (error) {
            console.error('Error rendering bug list:', error);
            this.showError('Error rendering bug list');
        }
    }

    generateSummary(bugs) {
        const criticalCount = bugs.filter(bug => this.getSeverityInfo(bug.status_code).level === 'Critical').length;
        const highCount = bugs.filter(bug => this.getSeverityInfo(bug.status_code).level === 'High').length;
        
        return `
            <div class="bg-white rounded-lg shadow p-4 mb-6">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Issues Summary</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-red-50 p-3 rounded-lg">
                        <div class="text-red-800 text-sm font-medium">Critical Issues</div>
                        <div class="text-2xl font-bold text-red-600">${criticalCount}</div>
                    </div>
                    <div class="bg-orange-50 p-3 rounded-lg">
                        <div class="text-orange-800 text-sm font-medium">High Priority Issues</div>
                        <div class="text-2xl font-bold text-orange-600">${highCount}</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateBugCard(bug) {
        const severity = this.getSeverityInfo(bug.status_code);
        const timestamp = new Date(bug.timestamp).toLocaleString();
        
        return `
            <div class="bug-card bg-white rounded-lg shadow overflow-hidden">
                <div class="p-4">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <span class="method-badge ${bug.method.toLowerCase()}">${bug.method}</span>
                            <span class="bg-${severity.color}-100 text-${severity.color}-800 text-xs px-2 py-1 rounded-full">
                                ${severity.level}
                            </span>
                        </div>
                        <span class="text-sm text-gray-500">${timestamp}</span>
                    </div>
                    
                    <div class="font-mono text-sm mb-2">${this.escapeHtml(bug.path)}</div>
                    
                    <div class="text-sm text-gray-600 mb-4">
                        Status Code: <span class="font-medium">${bug.status_code}</span>
                    </div>

                    <div class="space-y-4">
                        ${this.generateDataSection('Request Details', bug.request_details)}
                        ${this.generateDataSection('Response Data', bug.response_data)}
                        ${bug.error_details ? this.generateDataSection('Error Details', bug.error_details) : ''}
                    </div>
                </div>
            </div>
        `;
    }

    generateDataSection(title, data) {
        if (!data) return '';

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

    filterBugs(bugs) {
        return bugs.filter(bug => {
            const matchesSeverity = this.filters.severity.size === 0 || 
                this.filters.severity.has(this.getSeverityInfo(bug.status_code).level.toLowerCase());
            
            const matchesMethod = this.filters.method.size === 0 || 
                this.filters.method.has(bug.method);

            return matchesSeverity && matchesMethod;
        });
    }

    sortBugs(bugs) {
        return [...bugs].sort((a, b) => {
            switch (this.sortConfig.field) {
                case 'severity':
                    const severityA = this.getSeverityWeight(a.status_code);
                    const severityB = this.getSeverityWeight(b.status_code);
                    return this.sortConfig.direction === 'desc' ? 
                        severityB - severityA : 
                        severityA - severityB;
                
                case 'status_code':
                    return this.sortConfig.direction === 'desc' ? 
                        b.status_code - a.status_code : 
                        a.status_code - b.status_code;
                
                case 'timestamp':
                default:
                    return this.sortConfig.direction === 'desc' ? 
                        new Date(b.timestamp) - new Date(a.timestamp) : 
                        new Date(a.timestamp) - new Date(b.timestamp);
            }
        });
    }

    getSeverityInfo(statusCode) {
        const code = parseInt(statusCode);
        
        if (code === 404) {
            return { level: 'Low', color: 'blue' };
        }
        if (code >= 500) {
            return { level: 'Critical', color: 'red' };
        }
        if (code === 401 || code === 403) {
            return { level: 'High', color: 'orange' };
        }
        if (code >= 400) {
            return { level: 'Medium', color: 'yellow' };
        }
        return { level: 'Info', color: 'gray' };
    }

    getSeverityWeight(statusCode) {
        const severity = this.getSeverityInfo(statusCode).level;
        const weights = {
            'Critical': 4,
            'High': 3,
            'Medium': 2,
            'Low': 1,
            'Info': 0
        };
        return weights[severity] || 0;
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
                    <i data-feather="check-circle" class="h-12 w-12 text-green-500 mx-auto mb-4"></i>
                    <p class="text-lg font-medium text-gray-900">No issues found</p>
                    <p class="text-sm text-gray-600 mt-2">All endpoints are working as expected</p>
>>>>>>> Stashed changes
                </div>
            </div>
        `;
        feather.replace();
    }

<<<<<<< Updated upstream
    renderBugDetails(bug) {
        return `
            <div class="space-y-4 text-sm">
                ${bug.occurrence_count > 1 ? `
                    <div>
                        <span class="font-medium">Occurrences:</span>
                        <span class="text-gray-600">${bug.occurrence_count}</span>
                    </div>
                    <div>
                        <span class="font-medium">First Seen:</span>
                        <pre class="mt-1 text-gray-600">${this.formatTimestamp(bug.first_seen)}</pre>
                    </div>
                    <div>
                        <span class="font-medium">Last Seen:</span>
                        <pre class="mt-1 text-gray-600">${this.formatTimestamp(bug.last_seen)}</pre>
                    </div>
                ` : ''}
                <div>
                    <span class="font-medium">Error Message:</span>
                    <pre class="mt-1 bg-gray-50 p-3 rounded text-gray-600 overflow-x-auto whitespace-pre-wrap">${this.escapeHtml(bug.evidence.error_message)}</pre>
                </div>
                ${bug.evidence.stack_trace ? `
                    <div>
                        <span class="font-medium">Stack Trace:</span>
                        <pre class="mt-1 bg-gray-50 p-3 rounded text-gray-600 overflow-x-auto whitespace-pre-wrap">${this.escapeHtml(bug.evidence.stack_trace)}</pre>
                    </div>
                ` : ''}
                <div>
                    <span class="font-medium">Reproduction Steps:</span>
                    <ol class="mt-1 list-decimal list-inside space-y-1">
                        ${bug.reproduction.steps.map(step => `
                            <li class="text-gray-600">${step}</li>
                        `).join('')}
                    </ol>
                </div>
                <div>
                    <span class="font-medium">cURL Command:</span>
                    <pre class="mt-1 bg-gray-50 p-3 rounded text-gray-600 overflow-x-auto">${this.escapeHtml(bug.reproduction.curl_command)}</pre>
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    <button class="copy-button px-3 py-1 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1" data-copy="${this.escapeHtml(bug.reproduction.curl_command)}">
                        <i data-feather="copy" class="w-4 h-4"></i>
                        Copy cURL
                    </button>
                </div>
            </div>
        `;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.bugs.length / this.bugsPerPage);
        return `
            <div class="flex items-center justify-between mt-6">
                <div class="text-sm text-gray-500">
                    Showing ${(this.currentPage - 1) * this.bugsPerPage + 1} to ${Math.min(this.currentPage * this.bugsPerPage, this.bugs.length)}
                    of ${this.bugs.length} bugs
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
        // Add pagination listeners
        const prevButton = this.container.querySelector('.pagination-prev');
        const nextButton = this.container.querySelector('.pagination-next');
        if (prevButton) {
            prevButton.addEventListener('click', () => this.changePage(this.currentPage - 1));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => this.changePage(this.currentPage + 1));
        }

        // Add bug details toggle listeners
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
=======
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    addEventListeners() {
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
>>>>>>> Stashed changes
                }
            });
        });

        // Add copy button listeners
        const copyButtons = this.container.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = button.dataset.copy;
                navigator.clipboard.writeText(text).then(() => {
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.setAttribute('data-feather', 'check');
                        if (window.feather) feather.replace();
                        setTimeout(() => {
                            icon.setAttribute('data-feather', 'copy');
                            if (window.feather) feather.replace();
                        }, 1000);
                    }
                });
            });
        });
    }

    changePage(newPage) {
        const totalPages = Math.ceil(this.bugs.length / this.bugsPerPage);
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderBugList();
        }
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Export for use in other modules
window.BugListComponent = BugListComponent;
