const request = require('supertest');
const app = require('../src/server');

describe('URL Shortener API', () => {
    let shortcode;

    test('POST /shorturls - Create short URL', async () => {
        const response = await request(app)
            .post('/shorturls')
            .send({
                url: 'https://www.example.com/very-long-url',
                validity: 60,
                shortcode: 'test123'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('shortLink');
        expect(response.body).toHaveProperty('expiry');
        expect(response.body.shortLink).toContain('test123');
        
        shortcode = 'test123';
    });

    test('GET /shorturls/:shortcode - Get URL statistics', async () => {
        const response = await request(app)
            .get(`/shorturls/${shortcode}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('shortcode');
        expect(response.body).toHaveProperty('originalUrl');
        expect(response.body).toHaveProperty('totalClicks');
        expect(response.body.shortcode).toBe(shortcode);
    });

    test('GET /health - Health check', async () => {
        const response = await request(app).get('/health');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('healthy');
    });

    test('POST /shorturls - Invalid URL', async () => {
        const response = await request(app)
            .post('/shorturls')
            .send({
                url: 'invalid-url'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('code');
    });

    test('GET /shorturls/:shortcode - Non-existent shortcode', async () => {
        const response = await request(app)
            .get('/shorturls/nonexistent');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.code).toBe('SHORTCODE_NOT_FOUND');
    });
});

describe('Logging Middleware', () => {
    const { Log } = require('../../logging_middleware/src/index');

    test('Log function - valid parameters', async () => {
        try {
            const result = await Log('backend', 'info', 'handler', 'Test log message');
            expect(result).toHaveProperty('logID');
            expect(result).toHaveProperty('message');
        } catch (error) {
            // If the external service is not available, we just check that validation passes
            expect(error.message).not.toContain('parameter');
        }
    });

    test('Log function - invalid parameters', async () => {
        await expect(Log('invalid', 'info', 'handler', 'Test')).rejects.toThrow();
        await expect(Log('backend', 'invalid', 'handler', 'Test')).rejects.toThrow();
        await expect(Log('backend', 'info', 'invalid', 'Test')).rejects.toThrow();
    });
});
