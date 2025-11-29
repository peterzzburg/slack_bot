module.exports = (payload) => {
    try {
        const { action, pull_request, repository, sender } = payload;

        // Validate required fields
        if (!pull_request || !repository || !sender) {
            console.log('[pull_request] Missing required fields, skipping');
            return null;
        }

        // Filter actions: only notify for important ones (user confirmed)
        const importantActions = ['opened', 'closed', 'ready_for_review'];
        if (!importantActions.includes(action)) {
            console.log(`[pull_request] Filtered out action: ${action}`);
            return null;
        }

        console.log(`[pull_request] Processing action: ${action}`);

        // Determine emoji and color based on action
        let emoji = '📌';
        let color = '#808080'; // Default grey

        if (action === 'opened') {
            emoji = '🟢';
            color = '#36a64f'; // Green
        }
        if (action === 'closed') {
            if (pull_request.merged) {
                emoji = '🟣';
                color = '#6f42c1'; // Purple for merged
            } else {
                emoji = '🚫';
                color = '#dc3545'; // Red for closed without merge
            }
        }
        if (action === 'ready_for_review') {
            emoji = '👀';
            color = '#2c7bb6'; // Blue
        }

        // Get branch information
        const headBranch = pull_request.head?.ref || 'unknown';
        const baseBranch = pull_request.base?.ref || 'unknown';
        const branchInfo = `${headBranch} → ${baseBranch}`;

        // Format PR body (truncate if needed)
        let bodyText = '';
        if (pull_request.body) {
            bodyText = pull_request.body.substring(0, 200);
            if (pull_request.body.length > 200) {
                bodyText += '...';
            }
        }

        // Use legacy attachment format (guaranteed to work with Incoming Webhooks)
        return {
            attachments: [
                {
                    color: color,
                    fallback: `Pull Request ${action}: ${pull_request.title}`,
                    pretext: `${emoji} *Pull Request ${action}*`,
                    fields: [
                        {
                            title: "Repo",
                            value: `<${repository.html_url}|${repository.full_name}>`,
                            short: true
                        },
                        {
                            title: "Branch",
                            value: `\`${branchInfo}\``,
                            short: true
                        },
                        {
                            title: "Title",
                            value: `<${pull_request.html_url}|${pull_request.title}>`,
                            short: false
                        },
                        {
                            title: "By",
                            value: sender.login,
                            short: true
                        },
                        {
                            title: "PR Number",
                            value: `#${pull_request.number}`,
                            short: true
                        }
                    ],
                    text: bodyText,
                    actions: [
                        {
                            type: "button",
                            text: "View PR",
                            url: pull_request.html_url
                        },
                        {
                            type: "button",
                            text: "View Files",
                            url: `${pull_request.html_url}/files`
                        }
                    ]
                }
            ]
        };
    } catch (error) {
        console.error('[pull_request] Error formatting message:', error.message);
        return null; // Don't send message if formatter fails
    }
};
