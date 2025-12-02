/**
 * Logs key information about incoming requests for debugging purposes.
 */
export default function requestLogger(req, res, next) {
    const authHeader = req.headers['authorization'] ? 'Present' : 'Missing';
    const apiKey = req.headers['x-api-key'] ? 'Present' : 'Missing';

    console.log(
        `[Request] ${new Date().toLocaleTimeString()} | ${req.method} ${req.originalUrl} ` + 
        `| Auth: ${authHeader} | API-Key: ${apiKey}`
    );
    // You can also log req.body here, but be mindful of password fields.
    
    next();
}