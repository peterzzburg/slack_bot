const workflowJob = require('./workflow_job');
const push = require('./push');
const pullRequest = require('./pull_request');
const review = require('./review');
const discussion = require('./discussion');
const workflowRun = require('./workflow_run');

const formatEvent = (eventType, payload) => {
    switch (eventType) {
        case 'workflow_job':
            return workflowJob(payload);
        case 'push':
            return push(payload);
        case 'pull_request':
            return pullRequest(payload);
        case 'pull_request_review':
            return review(payload);
        case 'discussion_comment':
            return discussion(payload);
        case 'workflow_run':
            return workflowRun(payload);
        default:
            return null;
    }
};

module.exports = { formatEvent };
