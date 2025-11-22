module.exports = (payload) => {
    const { ref, commits, repository, sender, pusher } = payload;
    const branch = ref.replace('refs/heads/', '');
    const commitCount = commits.length;

    const commitList = commits.map(c => {
        const shortHash = c.id.substring(0, 7);
        const firstLine = c.message.split('\n')[0];
        return `• <${c.url}|\`${shortHash}\`> - ${firstLine}`;
    }).join('\n');

    return {
        text: `📤 *Push to ${repository.full_name}*\n` +
            `*Branch:* ${branch}\n` +
            `*By:* ${pusher.name || sender.login}\n` +
            `*Commits:* ${commitCount}\n` +
            `${commitList}`
    };
};
