require('dotenv').config();
const express = require('express');
const axios = require('axios');
const verifySignature = require('./src/verifySignature');
const { formatEvent } = require('./src/formatters');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to capture raw body for signature verification
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

app.post('/hook', verifySignature, async (req, res) => {
    const eventType = req.headers['x-github-event'];
    const payload = req.body;

    console.log(`Received event: ${eventType}`);

    try {
        const message = formatEvent(eventType, payload);

        if (message) {
            if (process.env.SLACK_WEBHOOK) {
                await axios.post(process.env.SLACK_WEBHOOK, message);
                console.log(`Forwarded ${eventType} to Slack`);
            } else {
                console.log('SLACK_WEBHOOK not set, skipping send');
                console.log('Message would be:', JSON.stringify(message, null, 2));
            }
        } else {
            console.log(`No formatter for event type: ${eventType}`);
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Error processing webhook:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.send('GitHub to Slack Webhook Server is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
