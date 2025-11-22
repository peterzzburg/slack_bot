module.exports = (payload) => {
    const { workflow_job, repository, sender } = payload;
    const status = workflow_job.status;
    const conclusion = workflow_job.conclusion;

    let emoji = '⚙️';
    let actionText = `Workflow job ${status}`;

    if (conclusion) {
        actionText += ` (${conclusion})`;
        if (conclusion === 'success') emoji = '✅';
        if (conclusion === 'failure') emoji = '❌';
    }

    return {
        text: `${emoji} *Workflow Job Update*\n` +
            `*Repo:* <${repository.html_url}|${repository.full_name}>\n` +
            `*Job:* ${workflow_job.name}\n` +
            `*Status:* ${status}${conclusion ? ` - ${conclusion}` : ''}\n` +
            `*Triggered by:* ${sender.login}\n` +
            `<${workflow_job.html_url}|View Job>`
    };
};
