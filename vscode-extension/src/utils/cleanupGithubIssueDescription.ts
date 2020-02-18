export const cleanupGithubIssueDescription = (body: string) => {
    if (!body) {
        return '';
    }

    const descriptionRegex = /(\!\[togezr\sseparator\]\(https:\/\/aka\.ms\/togezr-issue-separator-image\)[\s\S]+\#\#\#\#\#\# powered by \[Togezr\]\(https\:\/\/aka\.ms\/togezr-issue-website-link\))/gm;
    const cleanIssueBody = body.replace(descriptionRegex, '');

    return cleanIssueBody;
};
