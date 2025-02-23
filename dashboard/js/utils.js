/**
 * Enhanced utility functions for the dashboard
 */
window.utils = {
    /**
     * Format numbers with locale support
     */
    formatNumber(num) {
        if (num === undefined || num === null) return '-';
        return new Intl.NumberFormat().format(num);
    },
    
    /**
     * Format dates with locale support and options
     */
    formatDate(date) {
        if (!date) return '-';
        try {
            return new Date(date).toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return '-';
        }
    },
    
    /**
     * Format duration with human-readable output
     */
    formatDuration(duration) {
        if (!duration) return '-';
        try {
            // Handle ISO duration format
            if (typeof duration === 'string' && duration.includes('T')) {
                const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                if (matches) {
                    const [_, hours, minutes, seconds] = matches;
                    return [
                        hours && `${hours}h`,
                        minutes && `${minutes}m`,
                        seconds && `${seconds}s`
                    ].filter(Boolean).join(' ');
                }
            }
            
            // Handle simple duration string
            return duration;
        } catch (error) {
            console.error('Error formatting duration:', error);
            return duration;
        }
    },
    
    /**
     * Format percentage with rounding and validation
     */
    formatPercentage(value) {
        if (value === undefined || value === null) return '-';
        try {
            const num = parseFloat(value);
            if (isNaN(num)) return '-';
            return `${Math.round(num)}%`;
        } catch (error) {
            console.error('Error formatting percentage:', error);
            return '-';
        }
    },
    
    /**
     * Truncate string with ellipsis
     */
    truncateString(str, length = 50) {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },
    
    /**
     * Get status code information
     */
    getStatusInfo(status) {
        const code = parseInt(status);
        if (code >= 500) {
            return {
                class: 'error',
                color: 'red',
                severity: 'Critical',
                icon: 'alert-octagon',
                description: 'Server Error'
            };
        }
        if (code === 401 || code === 403) {
            return {
                class: 'warning',
                color: 'orange',
                severity: 'Medium-High',
                icon: 'alert-triangle',
                description: 'Authentication Error'
            };
        }
        if (code >= 400) {
            return {
                class: 'warning',
                color: 'yellow',
                severity: 'Medium',
                icon: 'alert-circle',
                description: 'Client Error'
            };
        }
        if (code === 404) {
            return {
                class: 'info',
                color: 'blue',
                severity: 'Low',
                icon: 'info',
                description: 'Not Found'
            };
        }
        if (code >= 300) {
            return {
                class: 'info',
                color: 'gray',
                severity: 'Info',
                icon: 'help-circle',
                description: 'Redirection'
            };
        }
        return {
            class: 'success',
            color: 'green',
            severity: 'Success',
            icon: 'check-circle',
            description: 'Success'
        };
    },

    /**
     * Validate data object against schema
     */
    validateData(data, schema) {
        if (!data || typeof data !== 'object') {
            return { valid: false, error: 'Invalid data: not an object' };
        }

        for (const [field, requirements] of Object.entries(schema)) {
            if (requirements.required && !(field in data)) {
                return { valid: false, error: `Missing required field: ${field}` };
            }

            if (field in data) {
                const value = data[field];
                if (requirements.type && typeof value !== requirements.type) {
                    return { valid: false, error: `Invalid type for ${field}: expected ${requirements.type}` };
                }

                if (requirements.validate) {
                    const result = requirements.validate(value);
                    if (result !== true) {
                        return { valid: false, error: `Validation failed for ${field}: ${result}` };
                    }
                }
            }
        }

        return { valid: true };
    },

    /**
     * Create loading overlay element
     */
    createLoadingOverlay(message = 'Loading...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay hidden fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center';
        overlay.innerHTML = `
            <div class="text-center">
                <i data-feather="loader" class="h-8 w-8 text-blue-500 animate-spin"></i>
                <p class="mt-2 text-sm text-gray-600">${message}</p>
            </div>
        `;
        feather.replace(overlay.querySelector('[data-feather]'));
        return overlay;
    },

    /**
     * Create error message element
     */
    createErrorMessage(message, showRetry = false, onRetry = null) {
        const element = document.createElement('div');
        element.className = 'text-red-500 text-center py-8';
        element.innerHTML = `
            <i data-feather="alert-triangle" class="inline-block h-8 w-8 mb-4"></i>
            <p class="text-lg font-medium">${message}</p>
            ${showRetry ? `
                <button class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 retry-button">
                    Retry
                </button>
            ` : ''}
        `;
        feather.replace(element.querySelector('[data-feather]'));

        if (showRetry && onRetry) {
            element.querySelector('.retry-button').addEventListener('click', onRetry);
        }

        return element;
    },

    /**
     * Parse and validate JSON safely
     */
    safeParseJSON(str) {
        try {
            return { data: JSON.parse(str), error: null };
        } catch (error) {
            return { data: null, error: error.message };
        }
    },

    /**
     * Debounce function for performance optimization
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};
