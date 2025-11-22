# GitHub to Slack Webhook Server Walkthrough

I have successfully built the webhook server. Here is what has been implemented:

## 1. Server Implementation
- **`server.js`**: The main Express application. It listens on `/github/webhook`.
- **`src/verifySignature.js`**: Middleware that securely verifies the `x-hub-signature-256` header using the `GITHUB_SECRET`.

## 2. Event Formatters
I created modular formatters in `src/formatters/` for:
- **Workflow Jobs**: Reports status (success/failure) with emojis.
- **Push Events**: Shows branch, committer, and list of commits.
- **Pull Requests**: Displays PR status, title, and link.
- **PR Reviews**: Shows reviewer and outcome (approved/changes requested).
- **Discussions**: Forwards new comments.

## 3. Verification
I created a `test_webhook.js` script to simulate GitHub events locally.

### How to Run
1. Start the server:
   ```bash
   export GITHUB_SECRET=test_secret
   export PORT=3000
   npm start
   ```
2. In another terminal, run the test script:
   ```bash
   node test_webhook.js
   ```

## 4. Deployment
Detailed deployment instructions for Railway, Render, and VPS are included in `README.md`.

## Files Created
- `server.js`
- `package.json`
- `src/verifySignature.js`
- `src/formatters/*.js`
- `README.md`
- `test_webhook.js`
