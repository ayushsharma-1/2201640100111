const { Log } = require('./src/index');

// Test the logging middleware
async function testLogger() {
    try {
        console.log('Testing logging middleware...');
        
        // Test valid log
        const result = await Log('backend', 'info', 'handler', 'Application started successfully');
        console.log('Log sent successfully:', result);
        
        // Test error log
        await Log('backend', 'error', 'db', 'Database connection timeout');
        
        console.log('All tests completed');
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Only run tests if this file is executed directly
if (require.main === module) {
    testLogger();
}

module.exports = { testLogger };
