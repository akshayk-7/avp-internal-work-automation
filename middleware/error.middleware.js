const logger = require('../utils/logger');

/**
 * @desc    Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        logger.error('Error Stack:', err);
    } else {
        logger.error(err.message, { statusCode: err.statusCode, path: req.originalUrl });
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
