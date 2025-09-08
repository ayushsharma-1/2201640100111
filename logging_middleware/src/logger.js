const axios = require('axios');
require('dotenv').config();
const { STACK_VALUES, LEVEL_VALUES, BACKEND_PACKAGES } = require('./constants');

/**
 * Validates the log parameters
 * @param {string} stack - The application stack (backend)
 * @param {string} level - The log level (debug/info/warn/error/fatal)
 * @param {string} packageName - The package name
 * @param {string} message - The log message
 * @throws {Error} If any parameter is invalid
 */
function validateLogParameters(stack, level, packageName, message) {
    if (!stack || typeof stack !== 'string') {
        throw new Error('Stack parameter is required and must be a string');
    }
    
    if (!STACK_VALUES.includes(stack.toLowerCase())) {
        throw new Error(`Stack must be one of: ${STACK_VALUES.join(', ')}`);
    }
    
    if (!level || typeof level !== 'string') {
        throw new Error('Level parameter is required and must be a string');
    }
    
    if (!LEVEL_VALUES.includes(level.toLowerCase())) {
        throw new Error(`Level must be one of: ${LEVEL_VALUES.join(', ')}`);
    }
    
    if (!packageName || typeof packageName !== 'string') {
        throw new Error('Package parameter is required and must be a string');
    }
    
    if (!BACKEND_PACKAGES.includes(packageName.toLowerCase())) {
        throw new Error(`Package must be one of: ${BACKEND_PACKAGES.join(', ')}`);
    }
    
    if (!message || typeof message !== 'string') {
        throw new Error('Message parameter is required and must be a string');
    }
}

/**
 * Sends log to the external logging service
 * @param {string} stack - The application stack
 * @param {string} level - The log level
 * @param {string} packageName - The package name
 * @param {string} message - The log message
 * @returns {Promise<Object>} The response from the logging service
 */
async function sendLogToService(stack, level, packageName, message) {
    const logEndpoint = 'http://20.244.56.144/evaluation-service/logs';
    const accessToken = process.env.ACCESS_TOKEN;
    
    if (!accessToken) {
        throw new Error('ACCESS_TOKEN environment variable is required');
    }
    
    const logPayload = {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: packageName.toLowerCase(),
        message: message
    };
    
    try {
        const response = await axios.post(logEndpoint, logPayload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
        });
        
        return response.data;
    } catch (error) {
        // If the external service fails, we still want to continue execution
        // but we'll throw an error to let the caller know
        if (error.response) {
            throw new Error(`Logging service error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
            throw new Error('Failed to reach logging service - network error');
        } else {
            throw new Error(`Logging error: ${error.message}`);
        }
    }
}

/**
 * Main logging function
 * @param {string} stack - The application stack (backend/frontend)
 * @param {string} level - The log level (debug/info/warn/error/fatal)
 * @param {string} packageName - The package name
 * @param {string} message - The log message
 * @returns {Promise<Object>} The response from the logging service
 */
async function Log(stack, level, packageName, message) {
    try {
        // Validate parameters
        validateLogParameters(stack, level, packageName, message);
        
        // Send log to external service
        const result = await sendLogToService(stack, level, packageName, message);
        
        return result;
    } catch (error) {
        // Re-throw validation errors
        throw error;
    }
}

module.exports = {
    Log,
    validateLogParameters,
    sendLogToService
};
