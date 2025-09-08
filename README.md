# URL Shortener Project

A complete URL shortener microservice with custom logging middleware, built with Node.js and JavaScript.

## Project Structure

```
.
├── logging_middleware/          # Reusable logging middleware package
│   ├── src/
│   │   ├── constants.js        # Logging constants and validation rules
│   │   ├── logger.js          # Core logging functionality
│   │   └── index.js           # Main export file
│   ├── test.js                # Logging middleware tests
│   ├── package.json
│   ├── .env                   # Access token for logging API
│   └── README.md
│
├── backend/                    # URL shortener microservice
│   ├── src/
│   │   ├── controllers/       # API controllers
│   │   ├── handlers/          # Business logic handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── server.js         # Main application
│   │   ├── storage.js        # Data storage layer
│   │   └── utils.js          # Utility functions
│   ├── tests/
│   │   └── api.test.js       # API tests
│   ├── package.json
│   ├── .env                  # Environment configuration
│   └── README.md
│
├── setup.js                   # Project setup script
└── README.md                 # This file
```

## Features

### Logging Middleware
- Reusable logging package for backend applications
- Integration with external logging API (http://20.244.56.144/evaluation-service/logs)
- Support for all required log levels (debug, info, warn, error, fatal)
- Support for all backend packages (cache, controller, db, handler, etc.)
- Parameter validation and error handling
- Bearer token authentication
- Both synchronous and asynchronous logging options

### URL Shortener Microservice
- Create shortened URLs with optional custom shortcodes
- Configurable expiry time (default: 30 minutes)
- URL redirection with analytics tracking
- Comprehensive statistics and click analytics
- Robust error handling with proper HTTP status codes
- Extensive logging using the custom middleware
- CORS support and health monitoring
- In-memory storage (easily replaceable with database)

## Quick Start

1. **Run the setup script:**
```bash
node setup.js
```

2. **Test the logging middleware:**
```bash
cd logging_middleware
node test.js
```

3. **Start the URL shortener service:**
```bash
cd backend
npm start
```

## API Usage Examples

### Create a Short URL
```bash
curl -X POST http://localhost:3000/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.example.com/very-long-url",
    "validity": 60,
    "shortcode": "custom123"
  }'
```

**Response:**
```json
{
  "shortLink": "http://localhost:3000/custom123",
  "expiry": "2025-09-08T01:00:00.000Z"
}
```

### Get URL Statistics
```bash
curl http://localhost:3000/shorturls/custom123
```

### Access Short URL (Redirect)
```bash
curl -L http://localhost:3000/custom123
```

### Health Check
```bash
curl http://localhost:3000/health
```

## Logging Examples

```javascript
const { Log } = require('../../logging_middleware/src/index');

// Log successful operations
await Log('backend', 'info', 'service', 'User authentication successful');

// Log errors
await Log('backend', 'error', 'handler', 'Received string, expected bool');

// Log critical issues
await Log('backend', 'fatal', 'db', 'Critical database connection failure');
```

## Configuration

Both services use environment variables for configuration:

**logging_middleware/.env:**
```env
ACCESS_TOKEN=your_jwt_token_here
```

**backend/.env:**
```env
ACCESS_TOKEN=your_jwt_token_here
PORT=3000
NODE_ENV=development
```

## Testing

**Test the logging middleware:**
```bash
cd logging_middleware && node test.js
```

**Test the backend service:**
```bash
cd backend && npm test
```

## Architecture Highlights

- **Modular Design**: Separate logging middleware and URL shortener service
- **Comprehensive Logging**: Every significant operation is logged with appropriate context
- **Error Handling**: Robust error handling with descriptive messages
- **Validation**: Input validation for all API endpoints
- **Analytics**: Click tracking with referrer, user agent, and IP information
- **Scalability**: Easy to replace in-memory storage with databases
- **Standards Compliance**: RESTful API design with proper HTTP status codes

## Production Considerations

1. **Database Integration**: Replace in-memory storage with Redis/PostgreSQL
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Caching**: Add Redis for frequently accessed URLs
4. **Security**: Input sanitization and validation
5. **Monitoring**: Comprehensive logging and alerting
6. **Load Balancing**: High availability setup
7. **Geolocation**: Integration with proper geolocation services

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript (ES6+)
- **HTTP Client**: Axios
- **Testing**: Jest + Supertest
- **Storage**: In-memory (production: Redis/PostgreSQL)

## Compliance

This implementation follows all specified requirements:
- Mandatory use of custom logging middleware (no console.log or built-in loggers)
- Single microservice architecture
- No authentication required for API access
- Globally unique shortcodes
- 30-minute default validity
- Custom shortcode support
- Proper HTTP redirects
- Comprehensive error handling
- Detailed analytics tracking
