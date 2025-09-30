// const { Log } = require('../../../logging_middleware/src/index');
const storage = require('../storage');
const { isExpired, getClientIP, getLocationFromIP } = require('../utils');

/**
 * Handles redirection from short URL to original URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function redirectShortUrl(req, res) {
    try {
        const { shortcode } = req.params;
        // console.log('DEBUG: Redirect handler called:', { shortcode, userAgent: req.headers['user-agent']?.substring(0, 30), timestamp: new Date().toISOString() }); // Testing redirect functionality
        
        // await Log('backend', 'info', 'handler', `Processing redirect request for shortcode: ${shortcode}`);

        // Get URL data
        const urlData = await storage.getURL(shortcode);
        
        if (!urlData) {
            // await Log('backend', 'warn', 'handler', `Shortcode not found for redirect: ${shortcode}`);
            return res.status(404).json({
                error: 'Short URL not found',
                code: 'SHORTCODE_NOT_FOUND'
            });
        }

        // Check if URL has expired
        if (isExpired(urlData.expiresAt)) {
            // await Log('backend', 'warn', 'handler', `Expired shortcode accessed: ${shortcode}`);
            return res.status(410).json({
                error: 'This short URL has expired',
                code: 'URL_EXPIRED',
                expiredAt: urlData.expiresAt
            });
        }

        // Record click analytics
        const clickData = {
            referrer: req.get('Referrer') || req.get('Referer') || null,
            userAgent: req.get('User-Agent') || null,
            ipAddress: getClientIP(req),
            location: getLocationFromIP(getClientIP(req))
        };

        await storage.recordClick(shortcode, clickData);
        // await Log('backend', 'info', 'handler', `Redirect successful for shortcode: ${shortcode} to ${urlData.originalUrl}`);

        // Perform redirect
        res.redirect(302, urlData.originalUrl);

    } catch (error) {
        // await Log('backend', 'error', 'handler', `Error during redirect: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error during redirect',
            code: 'INTERNAL_ERROR'
        });
    }
}

module.exports = {
    redirectShortUrl
};
