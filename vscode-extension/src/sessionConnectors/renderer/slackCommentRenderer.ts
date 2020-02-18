const time = require('pretty-ms');

import { IGitHubConnector } from '../../connectorRepository/connectorRepository';
import { ISlackChannel } from '../../interfaces/ISlackChannel';
import { User } from '../../user';
import { cleanupGithubIssueDescription } from '../../utils/cleanupGithubIssueDescription';
import { getCleanCommitMessage } from '../../utils/getCleanCommitMessage';
import { getGuests } from '../../utils/getGuests';
import { DEFAULT_GITHUB_AVATAR } from '../constants';
import { githubAvatarRepository } from '../github/githubAvatarsRepository';
import {
    ISessionCommitPushEvent,
    ISessionEndEvent,
    ISessionEvent,
    ISessionStartEvent,
    ISessionUserJoinEvent,
} from './events';

const renderDivider = () => {
    return `{ "type": "divider" }`;
};

const renderHostHeader = (events: ISessionEvent[]) => {
    const startEvent = events[0] as ISessionStartEvent;
    const { user, sessionId } = startEvent;

    const endEvent = events.find((e) => {
        return e.type === 'end-session';
    });

    const statusText = endEvent ? 'Offline' : '⚡ Live';

    return `{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "<https://github.com/${user.userName}|${user.displayName}> started <vscode://ms-vsliveshare.vsliveshare/join?${sessionId}|LiveShare session>."
        },
        "accessory": {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": "${statusText}",
                "emoji": true
            }
        }
    }`;
};

const renderGithubIssueDetails = async (githubConnector: IGitHubConnector) => {
    if (!githubConnector.data) {
        throw new Error('No connector data set.');
    }

    const { githubIssue } = githubConnector.data;

    const cleanIssueBody = cleanupGithubIssueDescription(githubIssue.body);

    return `{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "[<${githubIssue.html_url}|#${githubIssue.number}>] ${
        githubIssue.title
    }\n${cleanIssueBody}"
        },
        "accessory": {
            "type": "image",
            "image_url": "${await githubAvatarRepository.getAvatarFor(
                githubIssue.user.login
            )}",
            "alt_text": "plants"
        }
    }`;
};

const renderGuests = async (events: ISessionEvent[]) => {
    const guests = events.filter((e) => {
        return e.type === 'guest-join' || e.type === 'start-session';
    }) as (ISessionUserJoinEvent | ISessionStartEvent)[];

    const renderedGuestsPromises: any[] = guests.map(async (guest) => {
        const imageUrl = guest.user.userName
            ? await githubAvatarRepository.getAvatarFor(guest.user.userName)
            : DEFAULT_GITHUB_AVATAR;

        return {
            type: 'image',
            image_url: imageUrl,
            alt_text: `${guest.user.displayName} (${guest.user.emailAddress})`,
        };
    });

    const renderedGuests = await Promise.all(renderedGuestsPromises);

    const suffix = renderedGuests.length === 1 ? '' : 's';
    renderedGuests.push({
        type: 'mrkdwn',
        text: `*${renderedGuests.length} guest${suffix}*`,
    });

    return `{
        "type": "context",
        "elements": ${JSON.stringify(renderedGuests, null, 2)}
    },
    {
        "type": "divider"
    }`;
};

const renderFooter = (events: ISessionEvent[]) => {
    const startEvent = events[0] as ISessionStartEvent;
    const { sessionId } = startEvent;

    const endEvent = events.find((e) => {
        return e.type === 'end-session';
    });

    if (endEvent) {
        return null;
    }

    const text = `<vscode://ms-vsliveshare.vsliveshare/join?${sessionId}|Join in VSCode> `;

    return `{
        "type": "section",
        "text": {
                "type": "mrkdwn",
                "text": "*[ ${text} ]*\n\n"
        }
    },
    {
        "type": "divider"
    }`;
};

const renderThreadTs = (threadTs?: string) => {
    if (!threadTs) {
        return '';
    }

    return `"ts": "${threadTs}",`;
};

const renderNotificationTitle = (events: ISessionEvent[]) => {
    const startEvent = events[0] as ISessionStartEvent;
    const { user } = startEvent;

    return `${user.displayName} (${user.emailAddress}) started LiveShare session`;
};

const renderGuestJoinEvent = async (
    event: ISessionUserJoinEvent,
    events: ISessionEvent[]
) => {
    const user = new User(event.user);

    return {
        text: `${user.displayName} joined the session.`,
        blocks: [
            {
                type: 'context',
                elements: [
                    {
                        type: 'image',
                        image_url: await user.getUserAvatarLink(),
                        alt_text: user.displayName,
                    },
                    {
                        type: 'mrkdwn',
                        text: `${user.getSlackUserLink()} joined the session.`,
                    },
                ],
            },
        ],
    };
};

const renderCommitPushEvent = async (
    event: ISessionCommitPushEvent,
    events: ISessionEvent[]
) => {
    const guests = getGuests(events);

    const guestsNames = guests
        .map((guest) => {
            return guest.user.displayName;
        })
        .join(', ');

    const guestsNamesWithLink = guests
        .map((guest) => {
            const user = new User(guest.user);

            return `${user.getSlackUserLink()}`;
        })
        .join(', ');

    const cleanCommitMessage = getCleanCommitMessage(event.commit.message);

    const guestsAvatars = await Promise.all(
        guests.map(async (guest) => {
            return {
                type: 'image',
                image_url: guest.user.userName
                    ? await githubAvatarRepository.getAvatarFor(
                          guest.user.userName
                      )
                    : DEFAULT_GITHUB_AVATAR,
                alt_text: guest.user.displayName,
            };
        })
    );

    return {
        text: `${guestsNames} pushed 1 commit: ${cleanCommitMessage}`,
        blocks: [
            {
                type: 'context',
                elements: [
                    ...guestsAvatars,
                    {
                        type: 'mrkdwn',
                        text: `${guestsNamesWithLink} pushed <${event.repoUrl}/commit/${event.commit.hash}|1 commit: ${cleanCommitMessage}>`,
                    },
                ],
            },
        ],
    };
};

const renderSessionEndEvent = async (
    event: ISessionEndEvent,
    events: ISessionEvent[]
) => {
    const sessionStartEvent = events[0] as ISessionStartEvent;

    const timeDelta = event.timestamp - sessionStartEvent.timestamp;

    return {
        text: `LiveShare session ended.`,
        blocks: [
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `🤗 Session ended. (${time(timeDelta)})`,
                    },
                ],
            },
        ],
    };
};

export class SlackCommentRenderer {
    constructor(private githubConnector?: IGitHubConnector) {}

    public render = async (
        events: ISessionEvent[],
        channel: ISlackChannel,
        threadTs?: string
    ) => {
        const blocks = [
            renderDivider(),
            renderHostHeader(events),
            renderDivider(),
        ];

        if (this.githubConnector) {
            blocks.push(
                await renderGithubIssueDetails(this.githubConnector),
                renderDivider()
            );
        }

        blocks.push(await renderGuests(events));

        const footer = renderFooter(events);
        if (footer) {
            blocks.push(footer);
        }

        return `{
            "channel": "${channel.id}",
            "text": "${renderNotificationTitle(events)}",
            ${renderThreadTs(threadTs)}
            "blocks": [ ${blocks.join(', ')} ]
        }`;
    };

    public renderEvent = async (
        event:
            | ISessionUserJoinEvent
            | ISessionCommitPushEvent
            | ISessionEndEvent,
        events: ISessionEvent[]
    ) => {
        if (event.type === 'guest-join') {
            return await renderGuestJoinEvent(event, events);
        }

        if (event.type === 'commit-push') {
            return await renderCommitPushEvent(event, events);
        }

        if (event.type === 'end-session') {
            return await renderSessionEndEvent(event, events);
        }

        throw new Error('Unknown event.');
    };
}
