/**
 * Utility functions for the dashboard
 */
window.utils = {
    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    },
    
    formatDate(date) {
        return new Date(date).toLocaleString();
    },
    
    formatDuration(duration) {
        if (!duration) return '-';
        return duration;
    },
    
    formatPercentage(value) {
        return `${Math.round(value)}%`;
    },
    
    truncateString(str, length = 50) {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },
    
    getStatusClass(status) {
        if (status >= 500) return 'error';
        if (status >= 400) return 'warning';
        if (status >= 300) return 'info';
        if (status >= 200) return 'success';
        return 'default';
    }
};
