const time = require('pretty-ms');

import { clampString } from '../../utils/clampString';
import { ISSUE_SESSION_DETAILS_HEADER } from '../constants';
import { renderGuestsGithub } from '../renderGuestsGithub';
import {
    ISessionEvent,
    ISessionStartEvent,
    ISessionUserJoinEvent,
} from './events';
import { renderLiveShareCompactBadge } from './renderLiveShareCompactBadge';

const getCleanCommitMessage = (commitMessage: string) => {
    const split = commitMessage.split(/Co\-authored\-by\:\s+.+\s+\<.+.\>/gim);
    const result = split[0];

    return result.replace(/\n/gim, ' ');
};

export class GithubCommentRenderer {
    constructor(private sessionStartTimestamp: number) {}

    private async renderAllSessionUsers(
        guests: (ISessionUserJoinEvent | ISessionStartEvent)[]
    ) {
        const gustsWithSessions = guests.map((g) => {
            return {
                data: g.user,
                sessionCount: -1,
            };
        });
        const users = await renderGuestsGithub(gustsWithSessions);

        return users;
    }

    public render = async (events: ISessionEvent[]) => {
        const guests = events.filter((e) => {
            return e.type === 'guest-join' || e.type === 'start-session';
        }) as (ISessionUserJoinEvent | ISessionStartEvent)[];

        const renderedEvents = events.map((g) => {
            const timeDelta = g.timestamp - this.sessionStartTimestamp;
            const prettyTimeDelta = time(timeDelta);

            if (g.type === 'start-session') {
                const { user, sessionId } = g;

                return `🧑‍💻 @${
                    user.userName
                } started [Live Share session](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId}) ${renderLiveShareCompactBadge(
                    sessionId
                )}`;
            }

            if (g.type === 'guest-join') {
                return `- 🤝 @${g.user.userName} joined the session. (+${prettyTimeDelta})`;
            }

            if (g.type === 'end-session') {
                return `- 🤗 Session ended. (+${prettyTimeDelta})`;
            }

            if (g.type === 'commit-push') {
                const guestsUsers = guests.map((g, i) => {
                    return i === guests.length - 1
                        ? `and @${g.user.userName}`
                        : `@${g.user.userName}`;
                });

                const commitMessage = getCleanCommitMessage(g.commitMessage);
                const truncatedCommitMessage = clampString(commitMessage, 30);
                return `- 📌 ${guestsUsers.join(
                    ', '
                )} pushed [1 commit: ${truncatedCommitMessage}](${
                    g.repoUrl
                }/commit/${g.commitId}) (+${prettyTimeDelta})`;
            }
        });

        const guestsHeader = await this.renderAllSessionUsers(guests);
        const eventsString = [
            guestsHeader,
            ISSUE_SESSION_DETAILS_HEADER,
            renderedEvents.join('\n'),
        ].join('\n');

        return eventsString;
    };
}
