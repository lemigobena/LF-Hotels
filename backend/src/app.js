// This is our main app file where we handle requests
import url from 'url';

// Route Handlers
import * as authRoutes from './routes/authRoutes.js';
import * as hotelRoutes from './routes/hotelRoutes.js';
import * as productRoutes from './routes/productRoutes.js';
import * as reservationRoutes from './routes/reservationRoutes.js';
import * as reviewRoutes from './routes/reviewRoutes.js';

// This helps with CORS stuff for the frontend
const setCorsHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// Function for running the checks (middleware)
const runMiddleware = (req, res, middleware) => {
    return new Promise((resolve) => {
        const next = () => {
            resolve(true);
        };
        // Add status and json helpers
        if (!res.status) {
            res.status = (code) => {
                res.statusCode = code;
                return res;
            };
            res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                resolve(false);
            };
        }

        middleware(req, res, next).catch((err) => {
            console.log('Error in middleware!');
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Internal error' }));
            resolve(false);
        });
    });
};

export const handleRequest = async (req, res) => {
    // 1. Set CORS
    setCorsHeaders(res);

    // 2. Handle Preflight
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    // 3. Response Helpers (Shim)
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        return res;
    };

    // 4. Parse Body manually
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            if (body) {
                req.body = JSON.parse(body);
            } else {
                req.body = {};
            }
        } catch (error) {
            console.error('JSON Parse Error:', error);
            req.body = {}; // Fallback to empty body on parse failure
        }

        // 5. URL Parsing
        const parsedUrl = url.parse(req.url, true);
        req.query = parsedUrl.query;
        const pathname = parsedUrl.pathname;
        const method = req.method;

        console.log(`${method} ${pathname}`);

        try {
            // These are my route files
            if (await authRoutes.handleAuthRoutes(req, res, pathname, method, runMiddleware)) return;
            if (await hotelRoutes.handleHotelRoutes(req, res, pathname, method, runMiddleware)) return;
            if (await productRoutes.handleProductRoutes(req, res, pathname, method, runMiddleware)) return;
            if (await reservationRoutes.handleReservationRoutes(req, res, pathname, method, runMiddleware)) return;
            if (await reviewRoutes.handleReviewRoutes(req, res, pathname, method, runMiddleware)) return;

            // --- ROOT ---
            if (pathname === '/' && method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('LF Restaurant API is running (Raw Node Mode)');
                return;
            }

            // --- 404 NOT FOUND ---
            console.log(`404 Not Found: ${pathname}`);
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Route not found' }));

        } catch (err) {
            console.error('Controller Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    });
};
