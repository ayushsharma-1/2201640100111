const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { Log } = require('../../logging_middleware/src/index');

// Import routes and middleware
const urlRoutes = require('./routes/urlRoutes');
const { 
    errorHandler, 
    notFoundHandler, 
    requestLogger, 
    corsConfig 
} = require('./middleware');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize logging
async function initializeApp() {
    try {
        await Log('backend', 'info', 'service', 'URL Shortener Microservice starting up');
    } catch (error) {
        console.error('Failed to initialize logging:', error.message);
        process.exit(1);
    }
}

// Basic middleware
app.use(corsConfig);
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.use('/', urlRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', async () => {
    try {
        await Log('backend', 'info', 'service', 'Received SIGTERM, shutting down gracefully');
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
});

process.on('SIGINT', async () => {
    try {
        await Log('backend', 'info', 'service', 'Received SIGINT, shutting down gracefully');
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
});

// Unhandled promise rejection
process.on('unhandledRejection', async (reason, promise) => {
    try {
        await Log('backend', 'fatal', 'service', `Unhandled Promise Rejection: ${reason}`);
    } catch (error) {
        console.error('Critical error:', reason);
    }
    process.exit(1);
});

// Uncaught exception
process.on('uncaughtException', async (error) => {
    try {
        await Log('backend', 'fatal', 'service', `Uncaught Exception: ${error.message}`);
    } catch (logError) {
        console.error('Critical error:', error);
    }
    process.exit(1);
});

// Start server
async function startServer() {
    await initializeApp();
    
    app.listen(PORT, async () => {
        try {
            await Log('backend', 'info', 'service', `URL Shortener Microservice running on port ${PORT}`);
            await Log('backend', 'info', 'service', `Health check available at /health endpoint`);
        } catch (error) {
            // If logging fails, we can use console as fallback
            console.error('Failed to log server startup:', error.message);
        }
    });
}

// Start the application
if (require.main === module) {
    startServer().catch(async (error) => {
        try {
            await Log('backend', 'fatal', 'service', `Failed to start server: ${error.message}`);
        } catch (logError) {
            console.error('Failed to start server:', error);
        }
        process.exit(1);
    });
}

module.exports = app;
