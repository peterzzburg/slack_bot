module.exports = (payload) => {
    const { action, workflow_run, repository, sender } = payload;
    const status = workflow_run.status;
    const conclusion = workflow_run.conclusion;

    let emoji = '🚀';
    let actionText = `Workflow Run ${status}`;

    if (conclusion) {
        actionText += ` (${conclusion})`;
        if (conclusion === 'success') emoji = '✅';
        if (conclusion === 'failure') emoji = '❌';
    }

    return {
        text: `${emoji} *Workflow Run Update*\n` +
            `*Repo:* <${repository.html_url}|${repository.full_name}>\n` +
            `*Workflow:* ${workflow_run.name}\n` +
            `*Event:* ${workflow_run.event}\n` +
            `*Status:* ${status}${conclusion ? ` - ${conclusion}` : ''}\n` +
            `*Branch:* ${workflow_run.head_branch}\n` +
            `*Triggered by:* ${sender.login}\n` +
            `<${workflow_run.html_url}|View Run>`
    };
};
