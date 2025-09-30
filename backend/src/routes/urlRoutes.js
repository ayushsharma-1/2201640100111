const express = require('express');
const { createShortUrl, getShortUrlStats } = require('../controllers/urlController');
const { redirectShortUrl } = require('../handlers/redirectHandler');
// const { Log } = require('../../../logging_middleware/src/index');

const router = express.Router();

// // Middleware to log all route accesses
// router.use(async (req, res, next) => {
//     try {
//         // await Log('backend', 'debug', 'route', `${req.method} ${req.path} accessed`);
//     } catch (error) {
//         // Don't block request if logging fails
//     }
//     next();
// });

// Health check endpoint (must be before catch-all route)
router.get('/health', async (req, res) => {
    try {
        // await Log('backend', 'info', 'route', 'Health check requested');
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        // await Log('backend', 'error', 'route', `Health check error: ${error.message}`);
        res.status(500).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

// POST /shorturls - Create a new short URL
router.post('/shorturls', createShortUrl);

// GET /shorturls/:shortcode - Get statistics for a short URL
router.get('/shorturls/:shortcode', getShortUrlStats);

// GET /:shortcode - Redirect to original URL
router.get('/:shortcode', redirectShortUrl);

module.exports = router;
