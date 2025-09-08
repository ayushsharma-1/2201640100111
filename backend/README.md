# URL Shortener Microservice - Backend

A Node.js/Express.js microservice for URL shortening with analytics tracking and comprehensive logging. Built as a functional prototype with in-memory storage.

## Table of Contents
1. [Quick Start](#quick-start)
2. [What We've Built](#what-weve-built)
3. [Project Structure](#project-structure)
4. [API Endpoints](#api-endpoints)
5. [System Requirements](#system-requirements)
6. [Installation & Setup](#installation--setup)
7. [Configuration](#configuration)
8. [Usage Examples](#usage-examples)
9. [Testing](#testing)
10. [Logging Integration](#logging-integration)
11. [Current Limitations](#current-limitations)
12. [Production Migration Path](#production-migration-path)
13. [Troubleshooting](#troubleshooting)

## Quick Start

```bash
# 1. Clone and install dependencies
npm install

# 2. Create environment file
cp .env.example .env  # Edit with your ACCESS_TOKEN

# 3. Start the server
npm start

# 4. Test the API
curl -X POST http://localhost:3000/shorturls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "validity": 60}'
```

Server runs on: **http://localhost:3000**

## What We've Built

### Implemented Features
- **URL Shortening**: Convert long URLs to short links
- **Custom Shortcodes**: User-defined shortcodes (optional)
- **Expiry Management**: Configurable link expiration (default: 30 minutes)
- **Click Analytics**: Track clicks with referrer, IP, timestamp
- **Statistics API**: Detailed click analytics and URL information
- **Health Monitoring**: Server health check endpoint
- **Comprehensive Logging**: Integration with external logging service
- **Error Handling**: Structured error responses with proper HTTP codes
- **CORS Support**: Cross-origin request handling
- **Input Validation**: URL format and shortcode validation

### What We Don't Have (Intentional Limitations)
- **No Database**: Uses in-memory storage (JavaScript Maps)
- **No User Authentication**: Open API access
- **No Rate Limiting**: Can handle requests without throttling
- **No Clustering**: Single Express server instance
- **No SSL/HTTPS**: HTTP only (suitable for localhost/testing)
- **No Data Persistence**: Data lost on server restart

## Project Structure

```
backend/
├── src/
│   ├── server.js                    # Main Express application & startup
│   ├── storage.js                   # In-memory storage using Maps
│   ├── utils.js                     # Utility functions (validation, shortcode gen)
│   ├── controllers/
│   │   └── urlController.js         # URL creation and statistics endpoints
│   ├── handlers/
│   │   └── redirectHandler.js       # URL redirection logic with analytics
│   ├── routes/
│   │   └── urlRoutes.js            # Route definitions and middleware
│   └── middleware/
│       └── index.js                # Custom middleware (logging, CORS, errors)
├── tests/
│   └── api.test.js                 # API endpoint tests
├── .env                            # Environment variables (ACCESS_TOKEN)
├── .gitignore                      # Git ignore patterns
├── package.json                    # Dependencies and scripts
├── README.md                       # This file
└── SYSTEM_DESIGN.md               # Detailed system architecture
```

## API Endpoints

### 1. Create Short URL
```http
POST /shorturls
Content-Type: application/json

{
  "url": "https://example.com/very-long-url",     // required
  "validity": 30,                                 // optional (minutes, default: 30)
  "shortcode": "custom123"                        // optional (auto-generated if not provided)
}
```

**Response (201 Created):**
```json
{
  "shortLink": "http://localhost:3000/custom123",
  "expiry": "2025-09-08T11:30:00.000Z"
}
```

### 2. Get URL Statistics
```http
GET /shorturls/{shortcode}
```

**Response (200 OK):**
```json
{
  "shortcode": "custom123",
  "originalUrl": "https://example.com/very-long-url",
  "createdAt": "2025-09-08T10:30:00.000Z",
  "expiresAt": "2025-09-08T11:30:00.000Z",
  "isExpired": false,
  "totalClicks": 5,
  "clickHistory": [
    {
      "timestamp": "2025-09-08T10:45:00.000Z",
      "referrer": "https://google.com",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "ipAddress": "192.168.1.1",
      "location": "Local Network"
    }
  ]
}
```

### 3. URL Redirection
```http
GET /{shortcode}
```

**Response:** 302 Redirect to original URL + Analytics tracking

### 4. Health Check
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-08T10:30:00.000Z",
  "uptime": 3661
}
```

### Error Response Format
```json
{
  "error": "Human readable error message",
  "code": "MACHINE_READABLE_CODE"
}
```

**Common Error Codes:**
- `INVALID_URL_PARAMETER` - Missing or invalid URL
- `INVALID_URL_FORMAT` - Malformed URL
- `INVALID_SHORTCODE_FORMAT` - Invalid shortcode format
- `SHORTCODE_COLLISION` - Shortcode already exists
- `SHORTCODE_NOT_FOUND` - Shortcode doesn't exist
- `URL_EXPIRED` - Short URL has expired
- `INTERNAL_ERROR` - Server error

## System Requirements

- **Node.js**: 16+ (recommended: 18+)
- **NPM**: 8+
- **Memory**: 512MB+ RAM
- **Network**: Internet access for external logging API

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create `.env` file:
```env
# Required: Access token for external logging API
ACCESS_TOKEN=your_jwt_token_here

# Optional: Server configuration
PORT=3000
NODE_ENV=development
```

### 3. Start the Server

**Production mode:**
```bash
npm start
```

**Development mode (with auto-restart):**
```bash
npm run dev
```

**With custom port:**
```bash
PORT=8080 npm start
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ACCESS_TOKEN` | Yes | - | JWT token for external logging API |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment (development/production) |

### Logging Configuration

The system uses a custom logging middleware that sends logs to:
- **Endpoint**: `http://20.244.56.144/evaluation-service/logs`
- **Authentication**: Bearer token (ACCESS_TOKEN)
- **Format**: JSON with stack, level, package, message fields

**Supported Log Levels:**
- `debug`, `info`, `warn`, `error`, `fatal`

**Supported Packages:**
- `service`, `controller`, `handler`, `db`, `route`, `middleware`, `auth`, `config`

## Usage Examples

### Create Short URL with cURL
```bash
# Basic URL shortening
curl -X POST http://localhost:3000/shorturls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'

# Custom shortcode with 2-hour expiry
curl -X POST http://localhost:3000/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com/user/repo", 
    "validity": 120,
    "shortcode": "github123"
  }'
```

### Get Statistics
```bash
curl http://localhost:3000/shorturls/github123
```

### Access Short URL
```bash
# Will redirect to original URL
curl -L http://localhost:3000/github123

# Or just get redirect info
curl -I http://localhost:3000/github123
```

### JavaScript/Node.js Usage
```javascript
const axios = require('axios');

// Create short URL
const response = await axios.post('http://localhost:3000/shorturls', {
  url: 'https://example.com/very-long-url',
  validity: 60,
  shortcode: 'example123'
});

console.log('Short URL:', response.data.shortLink);
console.log('Expires:', response.data.expiry);

// Get statistics
const stats = await axios.get('http://localhost:3000/shorturls/example123');
console.log('Total clicks:', stats.data.totalClicks);
```

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# API endpoint tests
npm test -- --testPathPattern=api.test.js

# Run with verbose output
npm test -- --verbose
```

### Manual Testing Checklist

1. **URL Creation:**
   ```bash
   curl -X POST http://localhost:3000/shorturls -H "Content-Type: application/json" -d '{"url":"https://example.com"}'
   ```

2. **Custom Shortcode:**
   ```bash
   curl -X POST http://localhost:3000/shorturls -H "Content-Type: application/json" -d '{"url":"https://example.com","shortcode":"test123"}'
   ```

3. **URL Redirection:**
   ```bash
   curl -L http://localhost:3000/test123
   ```

4. **Statistics:**
   ```bash
   curl http://localhost:3000/shorturls/test123
   ```

5. **Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```

6. **Error Handling:**
   ```bash
   curl -X POST http://localhost:3000/shorturls -H "Content-Type: application/json" -d '{"url":"invalid-url"}'
   ```

## Logging Integration

### How Logging Works

1. **Import logging middleware:**
   ```javascript
   const { Log } = require('../../logging_middleware/src/index');
   ```

2. **Use throughout application:**
   ```javascript
   await Log('backend', 'info', 'controller', 'URL created successfully');
   await Log('backend', 'error', 'db', 'Failed to store URL');
   await Log('backend', 'warn', 'handler', 'Expired URL accessed');
   ```

3. **Automatic logging on:**
   - Server startup/shutdown
   - All API requests
   - URL creation/access
   - Errors and warnings
   - Database operations

### Log Examples

**Successful URL Creation:**
```json
{
  "stack": "backend",
  "level": "info", 
  "package": "controller",
  "message": "Short URL created successfully: abc123"
}
```

**Error Handling:**
```json
{
  "stack": "backend",
  "level": "error",
  "package": "db", 
  "message": "Failed to store URL: Connection timeout"
}
```

## Current Limitations

### Data Storage
- **In-Memory Only**: All data stored in JavaScript Maps
- **No Persistence**: Data lost on server restart
- **Memory Bounded**: Limited by available RAM
- **Single Instance**: Cannot scale horizontally

### Performance
- **Single Thread**: One Node.js process
- **No Caching**: No Redis or CDN integration
- **No Connection Pooling**: Simple HTTP requests
- **Blocking Operations**: External logging calls block requests

### Security
- **No Authentication**: Open API access
- **No Rate Limiting**: Vulnerable to abuse
- **No Input Sanitization**: Basic validation only
- **HTTP Only**: No SSL/TLS encryption

### Monitoring
- **Basic Logging**: External API only
- **No Metrics**: No Prometheus/Grafana integration
- **No Alerting**: No error notifications
- **No Dashboard**: No real-time monitoring

## Production Migration Path

### Phase 1: Database Integration
```javascript
// Replace in-memory storage with Redis
const redis = require('redis');
const client = redis.createClient();

class URLStorage {
  async storeURL(shortcode, urlData) {
    await client.hset(`url:${shortcode}`, urlData);
  }
  
  async getURL(shortcode) {
    return await client.hgetall(`url:${shortcode}`);
  }
}
```

### Phase 2: Add Persistence & Caching
- **Primary Database**: PostgreSQL for persistent storage
- **Cache Layer**: Redis for frequently accessed URLs
- **Session Management**: Redis for user sessions (if adding auth)

### Phase 3: Scalability & Performance
- **Clustering**: PM2 or Kubernetes for multiple instances
- **Load Balancing**: Nginx or AWS ALB
- **CDN**: CloudFlare for global distribution
- **Monitoring**: Prometheus + Grafana stack

### Phase 4: Production Hardening
- **Security**: Rate limiting, input validation, HTTPS
- **Backup**: Automated database backups
- **CI/CD**: Automated testing and deployment
- **Monitoring**: Comprehensive error tracking and alerting

## Troubleshooting

### Common Issues

1. **"Access Token Required" Error**
   ```
   Solution: Ensure ACCESS_TOKEN is set in .env file
   Check: cat .env | grep ACCESS_TOKEN
   ```

2. **Port Already in Use**
   ```
   Error: EADDRINUSE :::3000
   Solution: Use different port or kill existing process
   Command: PORT=8080 npm start
   ```

3. **External Logging API Fails**
   ```
   Error: Logging service error: 401
   Solution: Verify ACCESS_TOKEN is valid and not expired
   ```

4. **URL Not Found After Creation**
   ```
   Issue: Server was restarted (in-memory storage cleared)
   Solution: Recreate the URL or implement persistent storage
   ```

5. **High Memory Usage**
   ```
   Issue: Too many URLs stored in memory
   Solution: Restart server or implement data cleanup
   Monitor: node --max-old-space-size=4096 src/server.js
   ```

### Debug Mode

Enable detailed logging:
```bash
DEBUG=* npm start
```

Check server health:
```bash
curl http://localhost:3000/health
```

Monitor memory usage:
```javascript
// Add to server.js for monitoring
setInterval(() => {
  const used = process.memoryUsage();
  console.log('Memory usage:', {
    rss: Math.round(used.rss / 1024 / 1024) + 'MB',
    heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
    heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB'
  });
}, 30000);
```

### Performance Testing

Basic load testing with curl:
```bash
# Create 100 URLs quickly
for i in {1..100}; do
  curl -X POST http://localhost:3000/shorturls \
    -H "Content-Type: application/json" \
    -d "{\"url\":\"https://example.com/test$i\"}" &
done
wait
```

Check how many URLs are stored:
```bash
curl http://localhost:3000/health
# Memory usage will increase with more URLs
```

---

## Summary

This URL Shortener Microservice is a **fully functional prototype** that demonstrates:

- Core URL shortening functionality
- RESTful API design with proper HTTP status codes
- Comprehensive analytics and click tracking  
- External logging service integration
- Proper error handling and validation
- Easy testing and development setup

**Perfect for:**
- Learning URL shortener architecture
- API development practice
- Demonstration and prototyping
- Integration testing
- Local development and testing

**Not suitable for:**
- Production deployment without modifications
- High-traffic applications
- Long-term data storage requirements
- Multi-user enterprise applications

The codebase is designed to be easily extensible and provides a solid foundation for building a production-ready URL shortener service.
