const time = require('pretty-ms');

import { clampString } from '../../utils/clampString';
import { getCleanCommitMessage } from '../../utils/getCleanCommitMessage';
import { ISSUE_SESSION_DETAILS_HEADER } from '../constants';
import { renderGuestsGithub } from '../github/renderGuestsGithub';
import {
    ISessionEvent,
    ISessionStartEvent,
    ISessionUserJoinEvent,
} from './events';
import { renderLiveShareCompactBadge } from './renderLiveShareCompactBadge';

export class GithubCommentRenderer {
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

    private getGuestsCommitMessage = (
        guests: (ISessionUserJoinEvent | ISessionStartEvent)[]
    ): string => {
        const guestsUsers = guests.map((g, i) => {
            return i === guests.length - 1 && i !== 0
                ? `and @${g.user.userName}`
                : `@${g.user.userName}`;
        });

        if (guestsUsers.length === 1) {
            return guestsUsers.toString();
        }

        const allButLastGuests = guestsUsers.slice(0, -1).join(', ');
        const lastGuest = guestsUsers.slice(-1);
        const joinedGuests = `${allButLastGuests} ${lastGuest}`;

        return joinedGuests;
    };

    public render = async (events: ISessionEvent[]) => {
        const guests = events.filter((e) => {
            return e.type === 'guest-join' || e.type === 'start-session';
        }) as (ISessionUserJoinEvent | ISessionStartEvent)[];

        const sessionStartEvent = events.find((event) => {
            return event.type === 'start-session';
        });

        if (!sessionStartEvent) {
            throw new Error('No start event found.');
        }

        const renderedEvents = events.map((g) => {
            const timeDelta = g.timestamp - sessionStartEvent.timestamp;
            const prettyTimeDelta = time(timeDelta);

            if (g.type === 'start-session') {
                const { user, sessionId } = g;

                return `🧑‍💻 @${
                    user.userName
                } started [Live Share session](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId}) ${renderLiveShareCompactBadge(
                    sessionId
                )}`;
            }

            if (g.type === 'restart-session') {
                const { sessionId } = g;

                return `- 💫 [Live Share session](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId}) restarted. (+${prettyTimeDelta})`;
            }

            if (g.type === 'guest-join') {
                return `- 🤝 @${g.user.userName} joined the session. (+${prettyTimeDelta})`;
            }

            /**
             * Don't render the end event since the GitHub bot should take care of it.
             */
            // if (g.type === 'end-session') {
            //     return `- 🤗 Session ended. (+${prettyTimeDelta})`;
            // }

            if (g.type === 'commit-push') {
                const commitMessage = getCleanCommitMessage(g.commit.message);
                const truncatedCommitMessage = clampString(commitMessage, 60);
                const joinedGuests = this.getGuestsCommitMessage(guests);

                return `- 📌 ${joinedGuests} pushed 1 commit: [${truncatedCommitMessage}](${g.repoUrl}/commit/${g.commit.hash}) (+${prettyTimeDelta})`;
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

export const githubCommentRenderer = new GithubCommentRenderer();
