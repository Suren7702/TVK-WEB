import dotenv from "dotenv";
dotenv.config();

/**
 * Enforces API Key and checks for Authorization header on secured routes.
 * * Routes exempted from this check MUST be defined BEFORE this middleware 
 * is applied in server.js.
 */
export default function checkAuth(req, res, next) {
    // 1. Check for x-api-key (Client must send 'x-api-key' header)
    const apiKey = req.headers['x-api-key'];
    // Using your environment variable name
    const expectedApiKey = process.env.API_SECRET_KEY; 

    if (!apiKey || apiKey !== expectedApiKey) {
        console.error(`-> 🚫 ERROR: Invalid/Missing x-api-key on path ${req.path}`);
        return res.status(403).json({ 
            message: 'Forbidden: Missing or invalid API Key in x-api-key header.' 
        });
    }

    // 2. Check for Authorization header (Bearer Token)
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // You would typically extract and verify the JWT token here
        // const token = authHeader.split(' ')[1];
        // req.user = verifyJwt(token); // e.g., attach user object to req
    } else {
        // If the route needs a token (e.g., /api/admin), the route handler 
        // will check req.user or call a secondary token validation middleware.
        console.warn(`-> ⚠️ WARN: Authorization token missing/malformed on secured path ${req.path}`);
    }
    
    next();
}