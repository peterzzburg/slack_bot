module.exports = (payload) => {
    const { action, review, pull_request, repository, sender } = payload;

    let emoji = '📝';
    let state = review.state;

    if (state === 'approved') emoji = '✅';
    if (state === 'changes_requested') emoji = '⚠️';

    return {
        text: `${emoji} *PR Review ${action}*\n` +
            `*Repo:* ${repository.full_name}\n` +
            `*PR:* <${pull_request.html_url}|${pull_request.title}>\n` +
            `*Reviewer:* ${sender.login}\n` +
            `*Outcome:* ${state}\n` +
            (review.body ? `>>> ${review.body.substring(0, 200)}${review.body.length > 200 ? '...' : ''}` : '')
    };
};
