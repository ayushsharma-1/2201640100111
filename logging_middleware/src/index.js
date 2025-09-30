const { Log } = require('./logger');
const { STACK_VALUES, LEVEL_VALUES, BACKEND_PACKAGES } = require('./constants');

// Export the main logging function and constants
module.exports = {
    Log,
    STACK_VALUES,
    LEVEL_VALUES,
    ALL_PACKAGES: BACKEND_PACKAGES
};
