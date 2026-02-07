// Custom utility functions for the application
module.exports = {
    // Example utility
    formatResponse: (status, message, data = null) => {
        return { status, message, data };
    }
};
