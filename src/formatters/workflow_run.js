module.exports = (payload) => {
    try {
        const { workflow_run, repository, sender } = payload;

        // Validate required fields
        if (!workflow_run || !workflow_run.head_branch) {
            console.log('[workflow_run] Missing required fields, skipping');
            return null;
        }

        const { head_branch } = workflow_run;

        // Branch filtering with logging
        const allowedBranches = ['newenv', 'staging'];
        const isReleaseBranch = head_branch.startsWith('release_');

        if (!allowedBranches.includes(head_branch) && !isReleaseBranch) {
            console.log(`[workflow_run] Filtered out branch: ${head_branch}`);
            return null;
        }

        console.log(`[workflow_run] Processing branch: ${head_branch}`);

        const status = workflow_run.status;
        const conclusion = workflow_run.conclusion;

        // Filter status: only allow in_progress and completed
        const allowedStatuses = ['in_progress', 'completed'];
        if (!allowedStatuses.includes(status)) {
            console.log(`[workflow_run] Filtered out status: ${status}`);
            return null;
        }

        // Determine color based on status/conclusion
        let color = '#808080'; // Default grey
        if (conclusion === 'success') color = '#36a64f'; // Green
        if (conclusion === 'failure') color = '#dc3545'; // Red
        if (conclusion === 'cancelled') color = '#ffc107'; // Yellow/Orange
        if (conclusion === 'timed_out') color = '#dc3545'; // Red (treat like failure)
        if (status === 'in_progress') color = '#2c7bb6'; // Blue

        // Determine title based on status/conclusion
        let title = 'Workflow Run Update';
        if (status === 'in_progress') {
            title = '🚀 Workflow Run Started';
        } else if (conclusion === 'success') {
            title = '✅ Workflow Run Succeeded';
        } else if (conclusion === 'failure') {
            title = '❌ Workflow Run Failed';
        } else if (conclusion === 'cancelled') {
            title = '⚠️ Workflow Run Cancelled';
        } else if (conclusion === 'timed_out') {
            title = '⏱️ Workflow Run Timed Out';
        }

        // Use legacy attachment format (guaranteed to work with Incoming Webhooks)
        return {
            attachments: [
                {
                    color: color,
                    fallback: `Workflow Run: ${workflow_run.name} - ${status}`,
                    pretext: `*${title}*`,
                    fields: [
                        {
                            title: "Repo",
                            value: `<${repository.html_url}|${repository.full_name}>`,
                            short: true
                        },
                        {
                            title: "Workflow",
                            value: workflow_run.name,
                            short: true
                        },
                        {
                            title: "Status",
                            value: `\`${status}${conclusion ? ` - ${conclusion}` : ''}\``,
                            short: true
                        },
                        {
                            title: "Event",
                            value: `\`${workflow_run.event}\``,
                            short: true
                        },
                        {
                            title: "Branch",
                            value: `\`${workflow_run.head_branch}\``,
                            short: true
                        },
                        {
                            title: "Triggered by",
                            value: sender.login,
                            short: true
                        }
                    ],
                    actions: [
                        {
                            type: "button",
                            text: "View Run",
                            url: workflow_run.html_url
                        }
                    ]
                }
            ]
        };
    } catch (error) {
        console.error('[workflow_run] Error formatting message:', error.message);
        return null; // Don't send message if formatter fails
    }
};
