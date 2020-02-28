import { clampString } from './clampString';

export const cleanupGithubIssueDescription = (
    body: string,
    truncate = Infinity
) => {
    if (!body) {
        return '';
    }

    const descriptionRegex = /(\!\[togezr\sseparator\]\(https:\/\/aka\.ms\/togezr-issue-separator-image\)[\s\S]+\#\#\#\#\#\# powered by \[Togezr\]\(https\:\/\/aka\.ms\/togezr-issue-website-link\))/gm;
    const cleanIssueBody = body
        .replace(descriptionRegex, '')
        .replace(/<img[^>]* src=\"([^\"]*)\"[^>]*>/gm, '')
        .replace(/\!\[.+?\]\(.+\)\s+?[\r\n|\n|\r]?/gm, '')
        .replace(/[\r\n|\n|\r]{3,5}/, '')
        .replace(/[\r\n|\n|\r]{3,5}/, '')
        .replace(/"/gm, '\\"');

    return clampString(cleanIssueBody, truncate);
};
