module.exports = (payload) => {
    try {
        const { action, comment, pull_request, repository, sender } = payload;

        // Validate required fields
        if (!comment || !pull_request || !repository || !sender) {
            console.log('[pull_request_review_comment] Missing required fields, skipping');
            return null;
        }

        console.log(`[pull_request_review_comment] Processing action: ${action}`);

        // Color coding for review comments
        let color = '#2c7bb6'; // Blue for comments
        let emoji = '💬';

        if (action === 'created') {
            emoji = '💬';
            color = '#2c7bb6'; // Blue
        } else if (action === 'edited') {
            emoji = '✏️';
            color = '#ffc107'; // Yellow
        } else if (action === 'deleted') {
            emoji = '🗑️';
            color = '#dc3545'; // Red
        }

        // Format comment body (truncate if needed)
        let commentText = '';
        if (comment.body) {
            commentText = comment.body.substring(0, 200);
            if (comment.body.length > 200) {
                commentText += '...';
            }
        }

        // Use legacy attachment format (guaranteed to work with Incoming Webhooks)
        return {
            attachments: [
                {
                    color: color,
                    fallback: `PR Review Comment ${action} by ${sender.login}`,
                    pretext: `${emoji} *PR Review Comment ${action}*`,
                    fields: [
                        {
                            title: "Repo",
                            value: `<${repository.html_url}|${repository.full_name}>`,
                            short: true
                        },
                        {
                            title: "By",
                            value: sender.login,
                            short: true
                        },
                        {
                            title: "PR",
                            value: `<${pull_request.html_url}|${pull_request.title}>`,
                            short: false
                        },
                        {
                            title: "File",
                            value: `\`${comment.path}\``,
                            short: false
                        }
                    ],
                    text: commentText,
                    actions: [
                        {
                            type: "button",
                            text: "View Comment",
                            url: comment.html_url
                        },
                        {
                            type: "button",
                            text: "View PR",
                            url: pull_request.html_url
                        }
                    ]
                }
            ]
        };
    } catch (error) {
        console.error('[pull_request_review_comment] Error formatting message:', error.message);
        return null; // Don't send message if formatter fails
    }
};
