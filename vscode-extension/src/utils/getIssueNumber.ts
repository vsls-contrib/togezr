export const getIssueNumber = (githubIssueUrl: string) => {
    const split = githubIssueUrl.split('/');
    const issueNumber = split[6];

    return issueNumber;
};
