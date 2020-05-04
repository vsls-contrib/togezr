const time = require('pretty-ms');

import { emojiForEvent } from '../../emoji/eventToEmojiMap';
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

        // dont render the lone host
        if (gustsWithSessions.length < 2) {
            return '';
        }

        const users = await renderGuestsGithub(gustsWithSessions);

        return users;
    }

    private getUsername = (name: string | null) => {
        if (!name) {
            return '<unknown>';
        }

        const userName = name.indexOf('@') !== -1 ? name : `@${name}`;

        return userName;
    };

    private getGuestsCommitMessage = (
        guests: (ISessionUserJoinEvent | ISessionStartEvent)[]
    ): string => {
        const guestsUsers = guests.map((g, i) => {
            return i === guests.length - 1 && i !== 0
                ? `and ${this.getUsername(g.user.userName)}`
                : this.getUsername(g.user.userName);
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

                return `${this.getUsername(
                    user.userName
                )} started [Live Share session](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId}) ${renderLiveShareCompactBadge(
                    sessionId
                )}`;
            }

            if (g.type === 'restart-session') {
                const { sessionId } = g;

                return `- ${emojiForEvent(
                    g
                )} [Live Share session](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId}) restarted. (+${prettyTimeDelta})`;
            }

            if (g.type === 'guest-join') {
                return `- @${
                    g.user.userName
                } joined the session. (+${prettyTimeDelta}) ${emojiForEvent(
                    g
                )}`;
            }

            /**
             * Don't render the end event since the GitHub bot should take care of it.
             */
            // if (g.type === 'end-session') {
            //     return `- Session ended. (+${prettyTimeDelta}) ${emojiForEvent(g)}`;
            // }

            if (g.type === 'commit-push') {
                const commitMessage = getCleanCommitMessage(g.commit.message);
                const truncatedCommitMessage = clampString(commitMessage, 60);
                const joinedGuests = this.getGuestsCommitMessage(guests);

                return `- 📌 ${joinedGuests} pushed 1 commit: [${truncatedCommitMessage}](${g.repoUrl}/commit/${g.commit.hash}) (+${prettyTimeDelta})`;
            }
        });

        const guestsHeader = await this.renderAllSessionUsers(guests);

        const guestsWithSeparator = [
            guestsHeader,
            ISSUE_SESSION_DETAILS_HEADER,
        ];

        const eventsString = [renderedEvents.join('\n')];

        if (guestsHeader) {
            eventsString.unshift(...guestsWithSeparator);
        }

        return eventsString.join('\n');
    };
}

export const githubCommentRenderer = new GithubCommentRenderer();
