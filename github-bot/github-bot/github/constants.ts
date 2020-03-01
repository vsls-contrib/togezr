export const GITHUB_BOT_SECRET = process.env['GITHUB_BOT_SECRET'];
export const GITHUB_CLIENT_ID = process.env['GITHUB_CLIENT_ID'];
export const GITHUB_CLIENT_SECRET = process.env['GITHUB_CLIENT_SECRET'];
export const GITHUB_APP_ID = parseInt(process.env['GITHUB_APP_ID'], 10);
export const GITHUB_APP_PRIVATE_KEY = process.env['GITHUB_APP_PRIVATE_KEY'];

if (!GITHUB_BOT_SECRET) {
    throw new Error('No GitHub Bot secret set.');
}

if (!GITHUB_CLIENT_ID) {
    throw new Error('No GitHub Client id set.');
}

if (!GITHUB_CLIENT_SECRET) {
    throw new Error('No GitHub Client app secret set.');
}

if (!GITHUB_APP_ID) {
    throw new Error('No GitHub App id set.');
}

if (!GITHUB_APP_PRIVATE_KEY) {
    throw new Error('No GitHub App private key set.');
}

export const GITHUB_ISSUE_TOGEZR_FOOTER_REGEX = /(\!\[togezr\sseparator\]\(https:\/\/aka\.ms\/togezr-issue-separator-image\)[\s\S]+\#\#\#\#\#\# powered by \[Togezr\]\(https\:\/\/aka\.ms\/togezr-issue-website-link\))/gm;
export const GITHUB_ISSUE_FOOTER_BADGE_REGEX = /\[!\[Live Share session\]\(https:\/\/togezr-vsls-session-badge\.azurewebsites\.net\/api\/vsls-compact-badge\?sessionId.+\)/gm;
export const GITHUB_ISSUE_FOOTER_USERS_REGEX = /\[\<img\ssrc="https:\/\/avatars\d{1,3}\.githubusercontent\.com.+\]\(https:\/\/github\.com\/.+\)/gm;
export const GITHUB_ISSUE_FOOTER_BRANCH_REGEX = /\*\*⎇\*\*\s+?\[.+\]\(https:\/\/github\.com\/.+\/.+\/tree\/.+\)\s+?\[\s?\[⇄\smaster\]\(https:\/\/github\.com\/.+\)\s\]/gm;

export const GITHUB_ISSUE_FOOTER_SEPARATOR = '![togezr separator](https://aka.ms/togezr-issue-separator-image)';
export const GITHUB_ISSUE_FOOTER_POWERED_BY = '###### powered by [Togezr](https://aka.ms/togezr-issue-website-link)';