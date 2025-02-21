/**
 * Main bundle for initializing the dashboard
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize dashboard
        const dashboard = new Dashboard();
        await dashboard.initialize();

        // Initialize feather icons
        if (window.feather) {
            feather.replace();
        }

        // Add event listeners for filters
        const filterInputs = document.querySelectorAll('[data-filter]');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                const type = input.dataset.filter;
                if (window.endpointTree) {
                    window.endpointTree.toggleFilter(type);
                }
            });
        });

        // Add event listeners for bug details
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('[data-toggle-details]');
            if (toggle) {
                const id = toggle.dataset.toggleDetails;
                const details = document.getElementById(id);
                if (details) {
                    details.classList.toggle('hidden');
                    const icon = toggle.querySelector('i');
                    if (icon) {
                        icon.setAttribute(
                            'data-feather',
                            details.classList.contains('hidden') ? 'chevron-down' : 'chevron-up'
                        );
                        if (window.feather) {
                            feather.replace();
                        }
                    }
                }
            }
        });

        // Add event listeners for pagination
        document.addEventListener('click', (e) => {
            const button = e.target.closest('[data-page]');
            if (button) {
                const page = parseInt(button.dataset.page);
                if (window.endpointTree) {
                    window.endpointTree.changePage(page);
                }
            }
        });

        // Handle errors
        window.onerror = function(msg, url, line, col, error) {
            console.error('Error:', error);
            const container = document.querySelector('.container');
            if (container) {
                container.innerHTML = `
                    <div class="error-message">
                        <h2 class="text-xl font-bold mb-4">Error Loading Dashboard</h2>
                        <p class="mb-4">An error occurred while loading the dashboard:</p>
                        <pre class="bg-gray-50 p-4 rounded">${error?.toString() || msg}</pre>
                        <a href="../index.html" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                            ← Back to Overview
                        </a>
                    </div>
                `;
            }
            return false;
        };

    } catch (error) {
        console.error('Error initializing dashboard:', error);
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2 class="text-xl font-bold mb-4">Error Loading Dashboard</h2>
                    <p class="mb-4">An error occurred while loading the dashboard:</p>
                    <pre class="bg-gray-50 p-4 rounded">${error.toString()}</pre>
                    <a href="../index.html" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                        ← Back to Overview
                    </a>
                </div>
            `;
        }
    }
});
