// Redirect to component-based implementation
window.initializeCharts = function() {
    console.warn('Using legacy chart initialization. Please update to use ChartsComponent.');
    const charts = new ChartsComponent();
    const coverage = window[`${window.fuzzerName}Coverage`] || {};
    charts.createCoverageChart(coverage);
    charts.createMethodChart(coverage);
    charts.createStatusChart(coverage);
    charts.updateCoverageProgress();
};
