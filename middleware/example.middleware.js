// Custom middleware functions for the application
module.exports = {
    // Example middleware
    logger: (req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    }
};
