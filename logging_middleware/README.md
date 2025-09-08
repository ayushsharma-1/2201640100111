# Universal Logging Middleware

A reusable logging middleware for Node.js backend applications that integrates with external logging services.

## Features

- **Comprehensive Logging**: Supports all log levels (debug, info, warn, error, fatal)
- **Backend Package Support**: Covers all backend components (cache, controller, cron_job, db, domain, handler, repository, route, service, auth, config, middleware)
- **External API Integration**: Sends logs to external evaluation service
- **Parameter Validation**: Validates all log parameters before sending
- **Error Handling**: Robust error handling with descriptive messages
- **Async Support**: Both synchronous and asynchronous logging options

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file with your access token:

```env
ACCESS_TOKEN=your_access_token_here
```

## Usage

### Basic Usage

```javascript
const { Log } = require('universal-logging-middleware');

// Log an error
await Log('backend', 'error', 'handler', 'Received string, expected bool');

// Log database issues
await Log('backend', 'fatal', 'db', 'Critical database connection failure');

// Log successful operations
await Log('backend', 'info', 'service', 'User authentication successful');
```

### Async Logging (Fire and Forget)

```javascript
const { LogAsync } = require('universal-logging-middleware');

// This won't wait for the API response
LogAsync('backend', 'debug', 'middleware', 'Request processed');
```

## Parameters

- **stack**: Must be 'backend' (lowercase)
- **level**: One of 'debug', 'info', 'warn', 'error', 'fatal' (lowercase)
- **package**: One of the supported backend packages (lowercase)
- **message**: Descriptive log message (string)

## Supported Packages

- `cache` - Caching operations
- `controller` - Controller logic
- `cron_job` - Scheduled tasks
- `db` - Database operations
- `domain` - Domain/business logic
- `handler` - Request handlers
- `repository` - Data access layer
- `route` - Routing logic
- `service` - Service layer
- `auth` - Authentication
- `config` - Configuration management
- `middleware` - Middleware functions

## Testing

```bash
npm test
# or
node test.js
```

## API Response

Successful logs return:

```json
{
  "logID": "a4ad02e-19d8-4153-86d9-58bf55d7c402",
  "message": "Log created successfully"
}
```

## Error Handling

The middleware validates all parameters and provides descriptive error messages for:
- Missing or invalid parameters
- Unsupported stack values
- Unsupported log levels  
- Unsupported package names
- Network errors
- API service errors
