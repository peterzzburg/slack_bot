const axios = require('axios');
const crypto = require('crypto');

const SECRET = 'test_secret';
const URL = 'http://localhost:3009/hook';

const createSignature = (body) => {
    const hmac = crypto.createHmac('sha256', SECRET);
    return 'sha256=' + hmac.update(JSON.stringify(body)).digest('hex');
};

const sendEvent = async (event, payload) => {
    try {
        await axios.post(URL, payload, {
            headers: {
                'x-github-event': event,
                'x-hub-signature-256': createSignature(payload),
                'Content-Type': 'application/json'
            }
        });
        console.log(`✅ Sent ${event}`);
    } catch (error) {
        console.error(`❌ Failed ${event}:`, error.response ? error.response.data : error.message);
    }
};

const runTests = async () => {
    console.log('Running webhook tests...');

    // // 1. Workflow Job
    // await sendEvent('workflow_job', {
    //     workflow_job: { name: 'Build', status: 'completed', conclusion: 'success', html_url: 'http://github.com/job' },
    //     repository: { full_name: 'user/repo', html_url: 'http://github.com/user/repo' },
    //     sender: { login: 'tester' }
    // });

    // // 2. Push
    // await sendEvent('push', {
    //     ref: 'refs/heads/main',
    //     commits: [{ id: '1234567890', message: 'Fix bug', url: 'http://github.com/commit' }],
    //     repository: { full_name: 'user/repo' },
    //     sender: { login: 'tester' },
    //     pusher: { name: 'tester' }
    // });

    // 3. Pull Request
    await sendEvent('pull_request', {
        action: 'opened',
        pull_request: { title: 'New Feature', html_url: 'http://github.com/pr', state: 'open', body: 'Description' },
        repository: { full_name: 'user/repo' },
        sender: { login: 'tester' }
    });

    console.log('Done.');
};

runTests();
