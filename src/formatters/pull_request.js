module.exports = (payload) => {
    const { action, pull_request, repository, sender } = payload;

    let emoji = '📌';
    if (action === 'merged') emoji = '🟣';
    if (action === 'closed') emoji = '🚫';
    if (action === 'opened') emoji = '🟢';

    return {
        text: `${emoji} *Pull Request ${action}*\n` +
            `*Repo:* ${repository.full_name}\n` +
            `*Title:* <${pull_request.html_url}|${pull_request.title}>\n` +
            `*By:* ${sender.login}\n` +
            `*State:* ${pull_request.state}\n` +
            (pull_request.body ? `>>> ${pull_request.body.substring(0, 200)}${pull_request.body.length > 200 ? '...' : ''}` : '')
    };
};
