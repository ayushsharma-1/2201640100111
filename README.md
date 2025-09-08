# URL Shortener Microservice Project

## Project Overview
This project implements a URL shortener microservice with custom logging middleware as per the assignment requirements. It consists of two main components:

1. **Custom Logging Middleware** - A reusable package for application logging
2. **URL Shortener Service** - HTTP microservice for shortening and redirecting URLs

## Project Structure
```
Affordmen/
├── logging_middleware/     # Custom logging package
│   ├── src/
│   │   ├── constants.js   # Validation rules
│   │   ├── logger.js      # Core logging logic
│   │   └── index.js       # Package exports
│   ├── test.js           # Test file
│   ├── package.json
│   ├── .env             # Access token
│   └── README.md
│
├── backend/              # URL shortener service
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── handlers/    # Business logic
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   ├── server.js    # Main server file
│   │   ├── storage.js   # Data storage
│   │   └── utils.js     # Utilities
│   ├── tests/
│   │   └── api.test.js  # API tests
│   ├── package.json
│   ├── .env            # Configuration
│   └── README.md
│
└── setup.js            # Setup script
```

## Requirements Compliance

### Logging Middleware Requirements
- Custom logging middleware with `Log(stack, level, package, message)` function
- No use of console.log or built-in loggers in main application
- Integration with external API: `http://20.244.56.144/evaluation-service/logs`
- Support for all required levels: debug, info, warn, error, fatal
- Support for all backend packages: cache, controller, db, handler, middleware, route, service, utils
- Proper parameter validation and error handling

### URL Shortener Requirements
- RESTful HTTP microservice
- Create short URLs with POST `/shorturls`
- Get statistics with GET `/shorturls/{shortcode}`
- Redirect with GET `/{shortcode}`
- Health check endpoint
- Optional custom shortcode support
- 30-minute default validity period
- Comprehensive analytics tracking
- Proper HTTP status codes and error responses

## Setup Instructions

1. **Install Dependencies**
   ```bash
   # Install logging middleware dependencies
   cd logging_middleware
   npm install
   
   # Install backend service dependencies
   cd ../backend
   npm install
   ```

2. **Configure Environment**
   - Update `ACCESS_TOKEN` in both `.env` files with your JWT token
   - Default PORT is 3000 (configurable in backend/.env)

3. **Run the Application**
   ```bash
   # Test logging middleware first
   cd logging_middleware
   node test.js
   
   # Start the URL shortener service
   cd ../backend
   npm start
   ```

## API Usage

### Create Short URL
```bash
POST http://localhost:3000/shorturls
Content-Type: application/json

{
  "url": "https://www.example.com/long-url",
  "validity": 30,
  "shortcode": "custom123"
}
```

### Get URL Statistics
```bash
GET http://localhost:3000/shorturls/custom123
```

### Access Short URL (Redirect)
```bash
GET http://localhost:3000/custom123
```

### Health Check
```bash
GET http://localhost:3000/health
```

## Key Features

- **Custom Logging**: All operations logged using custom middleware
- **URL Shortening**: Generate short codes for long URLs
- **Custom Shortcodes**: Support for user-defined shortcodes
- **Analytics**: Track clicks, referrers, and user agents
- **Expiry Management**: Configurable URL validity periods
- **Error Handling**: Comprehensive error responses
- **Health Monitoring**: Service health check endpoint

## Technology Stack
- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **HTTP Client**: Axios (for logging API calls)
- **Storage**: In-memory (Map objects)
- **Testing**: Jest + Supertest

## Testing

```bash
# Test logging middleware
cd logging_middleware && node test.js

# Test backend service
cd backend && npm test
```

## Implementation Highlights

1. **No External Libraries**: Used only required dependencies (express, axios, etc.)
2. **Modular Design**: Separate logging and URL shortener components
3. **Comprehensive Logging**: Every operation logged with appropriate context
4. **Error Handling**: Proper HTTP status codes and descriptive error messages
5. **Validation**: Input validation for all endpoints
6. **Analytics**: Detailed tracking of URL usage patterns

## Project Completion Status

- Custom logging middleware implemented  
- URL shortener microservice completed  
- All API endpoints functional  
- Comprehensive error handling  
- Analytics and statistics tracking  
- Health monitoring implemented  
- Documentation and examples provided
