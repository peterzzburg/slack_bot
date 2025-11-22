module.exports = (payload) => {
    const { action, comment, discussion, repository, sender } = payload;

    return {
        text: `💬 *Discussion Comment ${action}*\n` +
            `*Repo:* ${repository.full_name}\n` +
            `*Discussion:* <${discussion.html_url}|${discussion.title}>\n` +
            `*By:* ${sender.login}\n` +
            `>>> ${comment.body.substring(0, 200)}${comment.body.length > 200 ? '...' : ''}`
    };
};
