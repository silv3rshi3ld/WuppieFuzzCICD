/**
 * Utility functions for the dashboard
 */

// Format a number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format a percentage with 1 decimal place
function formatPercentage(num) {
    return `${parseFloat(num).toFixed(1)}%`;
}

// Format a duration string (HH:MM:SS)
function formatDuration(duration) {
    if (!duration) return '00:00:00';
    return duration;
}

// Get color for status code
function getStatusColor(code) {
    code = parseInt(code);
    if (code >= 500) return '#dc2626';
    if (code >= 400) return '#f59e0b';
    if (code >= 200 && code < 300) return '#22c55e';
    return '#6b7280';
}

// Get description for status code
function getStatusDescription(code) {
    code = parseInt(code);
    if (code >= 500) return '⚠️ CRITICAL: Server Error!\nRequires immediate investigation';
    if (code >= 400) return 'Client Error - Check Request Parameters';
    if (code >= 200 && code < 300) return 'Success - Expected Response';
    if (code >= 300 && code < 400) return 'Redirection - Check Location Header';
    return 'Unknown Status';
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Convert string to URL-friendly slug
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Export utilities for use in other modules
window.utils = {
    formatNumber,
    formatPercentage,
    formatDuration,
    getStatusColor,
    getStatusDescription,
    escapeHtml,
    slugify
};
