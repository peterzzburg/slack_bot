const formatter = require('./src/formatters/workflow_run');

const testCases = [
    // Branch filtering tests
    { branch: 'release_v1', status: 'completed', shouldPass: true, description: 'release branch + completed' },
    { branch: 'release_2023', status: 'in_progress', shouldPass: true, description: 'release branch + in_progress' },
    { branch: 'newenv', status: 'completed', shouldPass: true, description: 'newenv + completed' },
    { branch: 'staging', status: 'in_progress', shouldPass: true, description: 'staging + in_progress' },
    { branch: 'feature/xyz', status: 'completed', shouldPass: false, description: 'feature branch (filtered)' },
    { branch: 'main', status: 'completed', shouldPass: false, description: 'main branch (filtered)' },
    { branch: 'dev', status: 'completed', shouldPass: false, description: 'dev branch (filtered)' },
    { branch: 'release-not-underscore', status: 'completed', shouldPass: false, description: 'release without underscore (filtered)' },

    // Status filtering tests
    { branch: 'staging', status: 'queued', shouldPass: false, description: 'staging + queued (filtered)' },
    { branch: 'release_v1', status: 'queued', shouldPass: false, description: 'release + queued (filtered)' },
    { branch: 'newenv', status: 'waiting', shouldPass: false, description: 'newenv + waiting (filtered)' },
];

console.log('Running verification tests...');

let passed = 0;
let failed = 0;

testCases.forEach(({ branch, status, shouldPass, description }) => {
    const payload = {
        action: 'completed',
        workflow_run: {
            status: status || 'completed',
            conclusion: status === 'completed' ? 'success' : null,
            head_branch: branch,
            name: 'Test Workflow',
            event: 'push',
            html_url: 'http://example.com'
        },
        repository: {
            full_name: 'user/repo',
            html_url: 'http://example.com/repo'
        },
        sender: {
            login: 'tester'
        }
    };

    const result = formatter(payload);
    const actuallyPassed = result !== null;

    if (actuallyPassed === shouldPass) {
        console.log(`✅ ${description}`);
        if (actuallyPassed) {
            // console.log(JSON.stringify(result, null, 2)); // Uncomment to see payload
        }
        passed++;
    } else {
        console.error(`❌ ${description} - Expected ${shouldPass ? 'Allowed' : 'Filtered'}, got ${actuallyPassed ? 'Allowed' : 'Filtered'}`);
        failed++;
    }
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
    process.exit(1);
}
