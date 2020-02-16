// const time = require('pretty-ms');

import { IConnectorData } from '../../interfaces/IConnectorData';
import { IGitHubIssue } from '../../interfaces/IGitHubIssue';
import { ISlackChannel } from '../../interfaces/ISlackChannel';
import { DEFAULT_GITHUB_AVATAR } from '../constants';
import { githubAvatarRepository } from '../github/githubAvatarsRepository';
// import { getIssueNumber } from '../slack/template';
import {
    ISessionEvent,
    ISessionStartEvent,
    ISessionUserJoinEvent,
} from './events';

// interface IGitHubIssueInfo {
//     url: string;
//     title: string;
//     description: string;
//     authorUsername: string;
// }

// const getCleanCommitMessage = (commitMessage: string) => {
//     const split = commitMessage.split(/Co\-authored\-by\:\s+.+\s+\<.+.\>/gim);
//     const result = split[0];

//     return result.replace(/\n/gim, ' ');
// };

const renderDivider = () => {
    return `{ "type": "divider" }`;
};

const renderHostHeader = (events: ISessionEvent[]) => {
    const startEvent = events[0] as ISessionStartEvent;
    const { user, sessionId } = startEvent;

    const endEvent = events.find((e) => {
        return e.type === 'end-session';
    });

    const statusText = endEvent ? '⚫ Offline' : '⚡ Live';

    return `{
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "<fakeLink.toUser.com|${user.displayName}> started <vscode://ms-vsliveshare.vsliveshare/join?${sessionId}|LiveShare session>."
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

const renderGithubIssueDetails = async (githubConnector: IConnectorData) => {
    const { githubIssue } = githubConnector.data as {
        githubIssue: IGitHubIssue;
    };

    const { body = '' } = githubIssue;

    const descriptionRegex = /(\!\[togezr\sseparator\]\(https:\/\/aka\.ms\/togezr-issue-separator-image\)[\s\S]+\#\#\#\#\#\# powered by \[Togezr\]\(https\:\/\/aka\.ms\/togezr-issue-website-link\))/gm;
    const cleanIssueBody = body.replace(descriptionRegex, '');

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

    const text = endEvent
        ? 'Session ended'
        : `<vscode://ms-vsliveshare.vsliveshare/join?${sessionId}|Join in VSCode> `;

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

export class SlackCommentRenderer {
    constructor(
        // private sessionStartTimestamp: number,
        private githubConnector?: IConnectorData
    ) {}

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
        blocks.push(renderFooter(events));

        return `{
            "channel": "${channel.id}",
            "text": "${renderNotificationTitle(events)}",
            ${renderThreadTs(threadTs)}
            "blocks": [ ${blocks.join(', ')} ]
        }`;
    };
}
