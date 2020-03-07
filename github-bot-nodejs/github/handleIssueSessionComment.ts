import { IGithubIssueSessionCommentEvent } from './interfaces/IGithubIssueSessionCommentEvent';
import { GITHUB_ISSUE_SESSION_COMMENT_REGEX } from './constants';
import { sessionCommentTracker } from './sessionCommentTracker/sessionCommentTracker';

const isSessionComment = (issueUpdateEvent: IGithubIssueSessionCommentEvent) => {
    const { comment } = issueUpdateEvent;
    if (!comment) {
        return false;
    }

    const { body } = comment;
    if (!body) {
        return false;
    }

    return GITHUB_ISSUE_SESSION_COMMENT_REGEX.test(body);
}

export const handleIssueSessionComment = async (issueUpdateEvent: IGithubIssueSessionCommentEvent) => {
    if (!isSessionComment(issueUpdateEvent)) {
        return;
    }

    sessionCommentTracker.trackGithubSessionComment(issueUpdateEvent);
};
