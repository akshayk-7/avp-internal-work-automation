/**
 * Health Check Controller
 * Verifies that the server and database are operational
 */
const db = require('../config/db');

const getHealth = async (req, res) => {
    try {
        // Check database connection
        await db.query('SELECT 1');

        res.status(200).json({
            status: 'success',
            message: 'Server and Database are operational',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            message: 'Service Unavailable',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getHealth
};
