import fetch from 'node-fetch';
const time = require('pretty-ms');

import { IGithubIssueSessionCommentEvent } from '../interfaces/IGithubIssueSessionCommentEvent';
import { GITHUB_ISSUE_SESSION_COMMENT_REGEX, MINUTE_MS, SECOND_MS, GITHUB_ISSUE_SESSION_COMMENT_SESSION_COMPLETE_LABEL } from '../constants';
import { matchAll } from '../../utils/matchAll';
import { IGithubIssue } from '../interfaces/IGithubIssue';
import { IGithubRepo } from '../interfaces/IGithubRepo';
import { IGithubComment } from '../interfaces/IGithubComment';
import { IGithubInstallation } from '../interfaces/IGithubInstallation';
import { githubApp } from '../app/githubApp';

const getSessionId = (body: string): string | null => {
    const matches = matchAll(body, GITHUB_ISSUE_SESSION_COMMENT_REGEX);
    if (!matches) {
        return null;
    }

    const result = [...matches][0] as Array<string> | undefined;

    if (!result || !result.length) {
        return null;
    }

    const [ _, sessionId ] = result;

    if (!sessionId) {
        return null;
    }

    return sessionId;
}

interface ITrackedIssueSessionComment {
    issue: IGithubIssue;
    comment: IGithubComment;
    repository: IGithubRepo;
    installation: IGithubInstallation;
    sessionId: string;
    sessionStartTimestamp: number;
    inactivityStartTimestamp?: number;
}

const isLiveShareSessionActive = async (session: ITrackedIssueSessionComment): Promise<boolean> => {
    const { sessionId } = session;

    const result = await fetch(`https://prod.liveshare.vsengsaas.visualstudio.com/api/v0.2/workspace/${sessionId}/owner/`);

    if (!result.ok) {
        return false;
    }

    try {
        const body = await result.json();

        if (!body) {
            return false;
        }

        return (body.connected === true);
    } catch (e) {
        console.error(e.message, e.stack);
        return false;
    }
    
}

const completeComment = async (commentDetails: ITrackedIssueSessionComment) => {
    try {
        const { installation, repository, comment, sessionStartTimestamp } = commentDetails;
        const token = await githubApp.getToken(installation.id);

        const owner = comment.user.login;
        const repo = repository.name;
        const comment_id = comment.id;
        const freshCommentResponse = await githubApp
            .rest(token)
            .issues.getComment({
                owner,
                repo,
                comment_id
            });

        if (freshCommentResponse.status !== 200) {
            console.warn(`Failed to complete session comment, cannot get comment details.`, commentDetails);
            return;
        }

        const freshComment: IGithubComment = await freshCommentResponse.data;

        if (!freshComment) {
            console.warn(`Failed to complete session comment, cannot get comment data.`, commentDetails);
            return;
        }

        const { body } = freshComment;
        if (!body) {
            console.error(`Expected to complete session comment, but body is empty.`);
            return;
        }

        const sessionDelta = Date.now() - sessionStartTimestamp;
        const result = await githubApp
            .rest(token)
            .issues.updateComment({
                owner,
                repo,
                comment_id,
                body: `${body}\n${GITHUB_ISSUE_SESSION_COMMENT_SESSION_COMPLETE_LABEL} (+${time(sessionDelta)})`
            });

        if (result.status !== 200) {
            console.warn(`Failed to complete session comment.`, commentDetails);
        }
    } catch (e) {
        console.error(`Failed to complete session comment due to an error.`, e.message, e.stack, commentDetails);
    }
}

export class SessionCommentTracker {
    private trackedSessions = new Map<number, ITrackedIssueSessionComment>();

    constructor(
        interval = 1 * MINUTE_MS,
        private inactivityThreshold = 1.5 * MINUTE_MS) {
        setInterval(this.onTimer, interval);
    }

    public trackGithubSessionComment = (issueUpdateEvent: IGithubIssueSessionCommentEvent) => {
        const { comment, issue, repository, installation } = issueUpdateEvent;
        const { body } = comment;

        if (!body) {
            console.warn(`Session commend was passed to session tracker, but no comment body set.`);
            return;
        }

        const sessionId = getSessionId(body);
        if (!sessionId) {
            console.warn(`Session commend was passed to session tracker, but no sessionId found.`, body);
            return;
        }

        const existingRecord = this.trackedSessions.get(comment.id);

        this.trackedSessions.set(comment.id, {
            comment,
            issue,
            repository,
            installation,
            sessionId,
            sessionStartTimestamp: Date.now(),
            ...existingRecord,
        });
    }

    private onTimer = async () => {
        for (let [ commentId, comment ] of this.trackedSessions) {
            const isSessionActive = await isLiveShareSessionActive(comment);

            if (isSessionActive) {
                this.trackedSessions.set(commentId, {
                    ...comment,
                    inactivityStartTimestamp: undefined
                });
                continue;
            }
            
            // if last period, complete the session
            const inactivityDelta = (Date.now() - comment.inactivityStartTimestamp);
            if (inactivityDelta >= this.inactivityThreshold) {
                this.deleteComment(commentId);
                await completeComment(comment);
                continue;
            }

            this.trackedSessions.set(commentId, {
                ...comment,
                inactivityStartTimestamp: comment.inactivityStartTimestamp || Date.now()
            });
        }
    }

    private deleteComment = (id: number) => {
        this.trackedSessions.delete(id);
    }
} 

export const sessionCommentTracker = new SessionCommentTracker();
