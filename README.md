# GitHub to Slack Webhook Server

A Node.js server that listens for GitHub webhooks, verifies signatures, formats events, and forwards them to Slack.

## Features

- 🔐 **Secure**: Verifies GitHub HMAC SHA256 signatures.
- 💬 **Formatted Messages**: Sends clean, readable messages to Slack.
- ⚙️ **Supported Events**:
  - Workflow Jobs
  - Push Events
  - Pull Requests
  - PR Reviews
  - Discussion Comments

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github-slack-webhook-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3009
   GITHUB_SECRET=your_github_webhook_secret
   SLACK_WEBHOOK=https://hooks.slack.com/services/...
   ```

## Usage

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Deployment

### Railway / Render / Fly.io

1. **Push your code to GitHub.**
2. **Connect your repository** to the hosting provider.
3. **Set Environment Variables** in the provider's dashboard:
   - `GITHUB_SECRET`
   - `SLACK_WEBHOOK`
   - `PORT` (usually automatically handled, but set to 3000 if needed)
4. **Deploy!**

### Simple VPS

1. **Install Node.js 18+** on your VPS.
2. **Clone the repo** and `npm install`.
3. **Use PM2** to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name github-slack-bot
   ```
4. **Setup Nginx** (optional) as a reverse proxy to port 3009.

### Docker

1. **Build the image**
   ```bash
   docker build -t github-slack-webhook .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     -p 3009:3009 \
     -e GITHUB_SECRET=your_secret \
     -e SLACK_WEBHOOK=your_webhook_url \
     --name slack-bot \
     github-slack-webhook
   ```

### Docker Compose

1. **Start the service**
   ```bash
   docker compose up -d
   ```

## GitHub Configuration

1. Go to your repository **Settings** > **Webhooks**.
2. Click **Add webhook**.
3. **Payload URL**: `https://your-server-url.com/hook`
4. **Content type**: `application/json`
5. **Secret**: Enter the same secret used in `.env`.
6. **Which events would you like to trigger this webhook?**
   - Select **Let me select individual events**.
   - Check:
     - Workflow jobs
     - Pushes
     - Pull requests
     - Pull request reviews
     - Discussions
7. Click **Add webhook**.

## Slack Configuration

1. Create an **Incoming Webhook** in your Slack workspace.
2. Copy the Webhook URL.
3. Add it to your `.env` as `SLACK_WEBHOOK`.
