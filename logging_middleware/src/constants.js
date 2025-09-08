// Types and constants for the logging middleware
const STACK_VALUES = ['backend'];
const LEVEL_VALUES = ['debug', 'info', 'warn', 'error', 'fatal'];
const BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service', 'auth', 'config', 'middleware'];

module.exports = {
    STACK_VALUES,
    LEVEL_VALUES,
    BACKEND_PACKAGES,
};
