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

const app = express();

// --- Middleware ---
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' })); // CORS configuration
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Routes ---
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/imports', importRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the SaaS Backend API' });
});

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
