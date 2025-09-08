const { Log } = require('../../../logging_middleware/src/index');
const storage = require('../storage');
const { 
    generateShortcode, 
    isValidUrl, 
    isValidShortcode, 
    createExpiryDate,
    isExpired 
} = require('../utils');

/**
 * Creates a new shortened URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createShortUrl(req, res) {
    try {
        await Log('backend', 'info', 'controller', 'Processing create short URL request');
        
        const { url, validity = 30, shortcode } = req.body;

        // Validate required URL parameter
        if (!url || typeof url !== 'string') {
            await Log('backend', 'warn', 'controller', 'Invalid or missing URL parameter');
            return res.status(400).json({
                error: 'URL parameter is required and must be a string',
                code: 'INVALID_URL_PARAMETER'
            });
        }

        // Validate URL format
        if (!isValidUrl(url)) {
            await Log('backend', 'warn', 'controller', `Invalid URL format: ${url}`);
            return res.status(400).json({
                error: 'Invalid URL format. Please provide a valid URL.',
                code: 'INVALID_URL_FORMAT'
            });
        }

        // Validate validity parameter if provided
        if (validity !== undefined && (!Number.isInteger(validity) || validity <= 0)) {
            await Log('backend', 'warn', 'controller', `Invalid validity parameter: ${validity}`);
            return res.status(400).json({
                error: 'Validity must be a positive integer representing minutes',
                code: 'INVALID_VALIDITY'
            });
        }

        let finalShortcode = shortcode;

        // If shortcode is provided, validate it
        if (shortcode) {
            if (!isValidShortcode(shortcode)) {
                await Log('backend', 'warn', 'controller', `Invalid shortcode format: ${shortcode}`);
                return res.status(400).json({
                    error: 'Shortcode must be alphanumeric and between 3-20 characters',
                    code: 'INVALID_SHORTCODE_FORMAT'
                });
            }

            // Check if shortcode already exists
            if (await storage.shortcodeExists(shortcode)) {
                await Log('backend', 'warn', 'controller', `Shortcode already exists: ${shortcode}`);
                return res.status(409).json({
                    error: 'Shortcode already exists. Please choose a different one.',
                    code: 'SHORTCODE_COLLISION'
                });
            }
        } else {
            // Generate unique shortcode
            let attempts = 0;
            const maxAttempts = 10;
            
            do {
                finalShortcode = generateShortcode();
                attempts++;
                
                if (attempts >= maxAttempts) {
                    await Log('backend', 'error', 'controller', 'Failed to generate unique shortcode after maximum attempts');
                    return res.status(500).json({
                        error: 'Unable to generate unique shortcode. Please try again.',
                        code: 'SHORTCODE_GENERATION_FAILED'
                    });
                }
            } while (await storage.shortcodeExists(finalShortcode));
        }

        // Create expiry date
        const expiry = createExpiryDate(validity);

        // Store URL data
        const urlData = {
            originalUrl: url,
            shortcode: finalShortcode,
            createdAt: new Date().toISOString(),
            expiresAt: expiry,
            validity: validity
        };

        await storage.storeURL(finalShortcode, urlData);

        // Construct short link (using localhost for demo - in production use actual hostname)
        const shortLink = `http://localhost:3000/${finalShortcode}`;

        await Log('backend', 'info', 'controller', `Short URL created successfully: ${finalShortcode}`);

        res.status(201).json({
            shortLink: shortLink,
            expiry: expiry
        });

    } catch (error) {
        await Log('backend', 'error', 'controller', `Error creating short URL: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error while creating short URL',
            code: 'INTERNAL_ERROR'
        });
    }
}

/**
 * Retrieves statistics for a shortened URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getShortUrlStats(req, res) {
    try {
        const { shortcode } = req.params;
        
        await Log('backend', 'info', 'controller', `Processing stats request for shortcode: ${shortcode}`);

        if (!shortcode || !isValidShortcode(shortcode)) {
            await Log('backend', 'warn', 'controller', `Invalid shortcode in stats request: ${shortcode}`);
            return res.status(400).json({
                error: 'Invalid shortcode format',
                code: 'INVALID_SHORTCODE'
            });
        }

        // Get URL data
        const urlData = await storage.getURL(shortcode);
        
        if (!urlData) {
            await Log('backend', 'warn', 'controller', `Shortcode not found: ${shortcode}`);
            return res.status(404).json({
                error: 'Shortcode not found',
                code: 'SHORTCODE_NOT_FOUND'
            });
        }

        // Get analytics data
        const clickData = await storage.getAnalytics(shortcode);
        const totalClicks = clickData.length;

        // Prepare response
        const stats = {
            shortcode: shortcode,
            originalUrl: urlData.originalUrl,
            createdAt: urlData.createdAt,
            expiresAt: urlData.expiresAt,
            isExpired: isExpired(urlData.expiresAt),
            totalClicks: totalClicks,
            clickHistory: clickData.map(click => ({
                timestamp: click.timestamp,
                referrer: click.referrer || 'Direct',
                userAgent: click.userAgent || 'Unknown',
                ipAddress: click.ipAddress || 'Unknown',
                location: click.location || 'Unknown'
            }))
        };

        await Log('backend', 'info', 'controller', `Stats retrieved successfully for shortcode: ${shortcode}`);

        res.json(stats);

    } catch (error) {
        await Log('backend', 'error', 'controller', `Error retrieving stats: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error while retrieving statistics',
            code: 'INTERNAL_ERROR'
        });
    }
}

module.exports = {
    createShortUrl,
    getShortUrlStats
};
