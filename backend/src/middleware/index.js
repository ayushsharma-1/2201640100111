const { Log } = require('../../../logging_middleware/src/index');

/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
    // Log the error
    Log('backend', 'error', 'middleware', `Unhandled error: ${err.message} - ${err.stack}`)
        .catch(() => {});

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).json({
        error: isDevelopment ? err.message : 'Internal server error',
        code: 'INTERNAL_ERROR',
        ...(isDevelopment && { stack: err.stack })
    });
}

/**
 * 404 Not Found middleware
 */
function notFoundHandler(req, res) {
    Log('backend', 'warn', 'middleware', `404 - Route not found: ${req.method} ${req.path}`)
        .catch(() => {});
        
    res.status(404).json({
        error: 'Route not found',
        code: 'ROUTE_NOT_FOUND',
        path: req.path,
        method: req.method
    });
}

/**
 * Request logging middleware
 */
function requestLogger(req, res, next) {
    const startTime = Date.now();
    
    // Log request start
    Log('backend', 'info', 'middleware', `${req.method} ${req.path} - Request started`)
        .catch(() => {});
    
    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(...args) {
        const duration = Date.now() - startTime;
        
        Log('backend', 'info', 'middleware', 
            `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
            .catch(() => {});
        
        originalEnd.apply(this, args);
    };
    
    next();
}

/**
 * CORS middleware configuration
 */
function corsConfig(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
}

module.exports = {
    errorHandler,
    notFoundHandler,
    requestLogger,
    corsConfig
};
