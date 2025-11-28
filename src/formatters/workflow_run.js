module.exports = (payload) => {
    const { action, workflow_run, repository, sender } = payload;
    const { head_branch } = workflow_run;

    // Filter branches: only allow release_**, newenv, and staging
    const allowedBranches = ['newenv', 'staging'];
    const isReleaseBranch = head_branch.startsWith('release_');

    if (!allowedBranches.includes(head_branch) && !isReleaseBranch) {
        return null;
    }

    const status = workflow_run.status;
    const conclusion = workflow_run.conclusion;

    // Filter status: only allow in_progress and completed
    const allowedStatuses = ['in_progress', 'completed'];
    if (!allowedStatuses.includes(status)) {
        return null;
    }

    let color = '#808080'; // Default grey
    if (conclusion === 'success') color = '#36a64f'; // Green
    if (conclusion === 'failure') color = '#dc3545'; // Red
    if (status === 'in_progress') color = '#2c7bb6'; // Blue

    return {
        attachments: [
            {
                color: color,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*Workflow Run ${status === 'in_progress' ? 'Started' : 'Update'}*`
                        }
                    },
                    {
                        type: "section",
                        fields: [
                            {
                                type: "mrkdwn",
                                text: `*Repo:*\n<${repository.html_url}|${repository.full_name}>`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Workflow:*\n${workflow_run.name}`
                            },
                            {
                                type: "mrkdwn",
                                text: `*Status:*\n\`${status}${conclusion ? ` - ${conclusion}` : ''}\``
                            },
                            {
                                type: "mrkdwn",
                                text: `*Event:*\n\`${workflow_run.event}\``
                            },
                            {
                                type: "mrkdwn",
                                text: `*Branch:*\n\`${workflow_run.head_branch}\``
                            },
                            {
                                type: "mrkdwn",
                                text: `*Triggered by:*\n${sender.login}`
                            }
                        ]
                    },
                    {
                        type: "actions",
                        elements: [
                            {
                                type: "button",
                                text: {
                                    type: "plain_text",
                                    text: "View Run",
                                    emoji: true
                                },
                                url: workflow_run.html_url
                            }
                        ]
                    }
                ]
            }
        ]
    };
};
