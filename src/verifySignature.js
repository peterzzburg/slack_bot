const crypto = require('crypto');

const verifySignature = (req, res, next) => {
    const signature = req.headers['x-hub-signature-256'];
    const secret = process.env.GITHUB_SECRET;

    if (!secret) {
        console.error('GITHUB_SECRET is not defined');
        return res.status(500).send('Server configuration error');
    }

    if (!signature) {
        return res.status(401).send('No signature found');
    }

    const hmac = crypto.createHmac('sha256', secret);
    // We need the raw body here. Express needs to be configured to provide it.
    // Assuming req.body is already parsed JSON, we might need to verify differently or use a raw body buffer.
    // Standard practice with Express is to verify on the raw body before JSON parsing.
    // However, if we use express.json({ verify: ... }), we can do it there.
    // For this middleware to work as a standalone, we'll assume req.rawBody is available or we handle it in server.js

    // Let's implement it assuming server.js sets up body parsing correctly to expose the raw body
    // or we can do the verification in the express.json() options in server.js.
    // But the plan asked for a separate middleware file.
    // Let's write this to be used with the verify option of express.json

    // Actually, a better pattern for express is to use the verify callback in express.json
    // But if we want a separate middleware, we need the raw body.
    // Let's assume server.js will attach rawBody to req.

    // Wait, the standard way is:
    // app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf } }))

    const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
        next();
    } else {
        res.status(401).send('Invalid signature');
    }
};

module.exports = verifySignature;
