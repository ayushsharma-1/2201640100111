const crypto = require('crypto');
const { Log } = require('universal-logging-middleware');

/**
 * Generates a unique shortcode
 * @param {number} length - Length of the shortcode (default: 6)
 * @returns {string} Generated shortcode
 */
function generateShortcode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

/**
 * Validates if a URL is properly formatted
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Validates shortcode format (alphanumeric, reasonable length)
 * @param {string} shortcode - Shortcode to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidShortcode(shortcode) {
    // Must be alphanumeric and between 3-20 characters
    const regex = /^[a-zA-Z0-9]{3,20}$/;
    return regex.test(shortcode);
}

/**
 * Gets the client's IP address from request
 * @param {Object} req - Express request object
 * @returns {string} Client IP address
 */
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           'unknown';
}

/**
 * Gets geographical location (simplified - returns country based on IP)
 * In a real application, you would use a geolocation service
 * @param {string} ip - IP address
 * @returns {string} Location information
 */
function getLocationFromIP(ip) {
    // Simplified location detection
    // In production, use services like MaxMind GeoIP2, ipapi.co, etc.
    if (ip === '127.0.0.1' || ip === '::1' || ip.includes('192.168.') || ip.includes('10.0.')) {
        return 'Local Network';
    }
    return 'Unknown Location'; // Placeholder
}

/**
 * Creates an ISO 8601 timestamp for the future
 * @param {number} minutes - Minutes to add to current time
 * @returns {string} ISO 8601 formatted timestamp
 */
function createExpiryDate(minutes) {
    const now = new Date();
    const expiry = new Date(now.getTime() + (minutes * 60 * 1000));
    return expiry.toISOString();
}

/**
 * Checks if a timestamp has expired
 * @param {string} isoTimestamp - ISO 8601 timestamp
 * @returns {boolean} True if expired, false otherwise
 */
function isExpired(isoTimestamp) {
    const expiry = new Date(isoTimestamp);
    const now = new Date();
    return now > expiry;
}

module.exports = {
    generateShortcode,
    isValidUrl,
    isValidShortcode,
    getClientIP,
    getLocationFromIP,
    createExpiryDate,
    isExpired
};
