#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');

console.log('Setting up URL Shortener Microservice Project...\n');

// Function to run command in directory
function runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { 
            cwd, 
            stdio: 'inherit',
            shell: true 
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}`));
            }
        });
    });
}

async function setup() {
    try {
        // Install logging middleware dependencies
        console.log('Installing logging middleware dependencies...');
        const loggingDir = path.join(__dirname, 'logging_middleware');
        await runCommand('npm', ['install'], loggingDir);
        
        // Install backend dependencies
        console.log('Installing backend dependencies...');
        const backendDir = path.join(__dirname, 'backend');
        await runCommand('npm', ['install'], backendDir);
        
        console.log('\nSetup completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Test the logging middleware:');
        console.log('   cd logging_middleware; node test.js');
        console.log('\n2. Start the URL shortener service:');
        console.log('   cd backend; npm start');
        console.log('\n3. Test the API endpoints:');
        console.log('   - Health check: http://localhost:3000/health');
        console.log('   - Create short URL: POST http://localhost:3000/shorturls');
        console.log('   - Get stats: GET http://localhost:3000/shorturls/{shortcode}');
        console.log('   - Redirect: GET http://localhost:3000/{shortcode}');
        console.log('\nExample API call:');
        console.log('curl -X POST http://localhost:3000/shorturls \\');
        console.log('  -H "Content-Type: application/json" \\');
        console.log('  -d \'{"url": "https://example.com", "validity": 30}\'');
        
    } catch (error) {
        console.error('Setup failed:', error.message);
        process.exit(1);
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setup();
}

module.exports = { setup };
