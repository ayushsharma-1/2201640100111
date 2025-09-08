const { Log } = require('../../logging_middleware/src/index');

/**
 * In-memory storage for URLs and analytics
 * In production, this would be replaced with a database like Redis, MongoDB, or PostgreSQL
 */
class URLStorage {
    constructor() {
        this.urls = new Map(); // shortcode -> url data
        this.analytics = new Map(); // shortcode -> click data array
        
        Log('backend', 'info', 'db', 'URL storage initialized successfully').catch(() => {});
    }

    /**
     * Stores a new shortened URL
     * @param {string} shortcode - The shortcode
     * @param {Object} urlData - URL data object
     */
    async storeURL(shortcode, urlData) {
        try {
            this.urls.set(shortcode, urlData);
            this.analytics.set(shortcode, []);
            
            await Log('backend', 'info', 'db', `URL stored with shortcode: ${shortcode}`);
            return true;
        } catch (error) {
            await Log('backend', 'error', 'db', `Failed to store URL: ${error.message}`);
            throw error;
        }
    }

    /**
     * Retrieves URL data by shortcode
     * @param {string} shortcode - The shortcode
     * @returns {Object|null} URL data or null if not found
     */
    async getURL(shortcode) {
        try {
            const urlData = this.urls.get(shortcode);
            
            if (urlData) {
                await Log('backend', 'debug', 'db', `URL retrieved for shortcode: ${shortcode}`);
            } else {
                await Log('backend', 'warn', 'db', `URL not found for shortcode: ${shortcode}`);
            }
            
            return urlData || null;
        } catch (error) {
            await Log('backend', 'error', 'db', `Failed to retrieve URL: ${error.message}`);
            throw error;
        }
    }

    /**
     * Checks if a shortcode already exists
     * @param {string} shortcode - The shortcode to check
     * @returns {boolean} True if exists, false otherwise
     */
    async shortcodeExists(shortcode) {
        try {
            const exists = this.urls.has(shortcode);
            await Log('backend', 'debug', 'db', `Shortcode existence check for ${shortcode}: ${exists}`);
            return exists;
        } catch (error) {
            await Log('backend', 'error', 'db', `Failed to check shortcode existence: ${error.message}`);
            throw error;
        }
    }

    /**
     * Records a click event
     * @param {string} shortcode - The shortcode
     * @param {Object} clickData - Click event data
     */
    async recordClick(shortcode, clickData) {
        try {
            const clicks = this.analytics.get(shortcode) || [];
            clicks.push({
                timestamp: new Date().toISOString(),
                ...clickData
            });
            this.analytics.set(shortcode, clicks);
            
            await Log('backend', 'info', 'db', `Click recorded for shortcode: ${shortcode}`);
        } catch (error) {
            await Log('backend', 'error', 'db', `Failed to record click: ${error.message}`);
            throw error;
        }
    }

    /**
     * Gets analytics data for a shortcode
     * @param {string} shortcode - The shortcode
     * @returns {Array} Array of click events
     */
    async getAnalytics(shortcode) {
        try {
            const analytics = this.analytics.get(shortcode) || [];
            await Log('backend', 'debug', 'db', `Analytics retrieved for shortcode: ${shortcode}, clicks: ${analytics.length}`);
            return analytics;
        } catch (error) {
            await Log('backend', 'error', 'db', `Failed to retrieve analytics: ${error.message}`);
            throw error;
        }
    }

    /**
     * Gets total number of URLs stored
     * @returns {number} Total count
     */
    async getTotalCount() {
        return this.urls.size;
    }
}

// Create a singleton instance
const storage = new URLStorage();

module.exports = storage;
