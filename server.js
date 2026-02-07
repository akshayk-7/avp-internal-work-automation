require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Load database
const db = require('./config/db');

// Import routes
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const clientRoutes = require('./routes/client.routes');
const importRoutes = require('./routes/import.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const { limiter } = require('./middleware/security.middleware');
const errorHandler = require('./middleware/error.middleware');
const logger = require('./utils/logger');

const app = express();

// --- Middleware ---
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(limiter); // Rate limiting
app.use(express.json({ limit: '10kb' })); // Parse JSON bodies with limit
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging request
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// --- Routes ---
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/imports', importRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handler
app.use(errorHandler);

// --- 404 Error Handling ---
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// --- Global Error Handling ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
