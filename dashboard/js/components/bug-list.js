/**
 * Bug list component for displaying crashes and issues
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
                </div>
            </div>
        `;
    }

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
