module.exports = (payload) => {
    const { action, comment, pull_request, repository, sender } = payload;

    return {
        text: `💬 *PR Review Comment ${action}*\n` +
            `*Repo:* ${repository.full_name}\n` +
            `*PR:* <${pull_request.html_url}|${pull_request.title}>\n` +
            `*By:* ${sender.login}\n` +
            `*File:* \`${comment.path}\`\n` +
            `>>> ${comment.body.substring(0, 200)}${comment.body.length > 200 ? '...' : ''}\n` +
            `<${comment.html_url}|View Comment>`
    };
};
