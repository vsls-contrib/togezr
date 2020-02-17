// const time = require('pretty-ms');

import { IConnectorData } from '../../interfaces/IConnectorData';
import { ISessionEvent, ISessionStartEvent } from './events';

export class SlackCommentRenderer {
    constructor(private githubConnector?: IConnectorData) {}

    public render = async (events: ISessionEvent[]) => {
        const sessionStart = events[0] as ISessionStartEvent;

        const { user: host } = sessionStart;

        return `{
            "@type": "MessageCard",
            "@context": "https://schema.org/extensions",
            "summary": "${host.displayName} started Live Share session",
            "title": "${host.displayName} started Live Share session",
            "sections": [
                {
                    "activityTitle": "${host.displayName}",
                    "activitySubtitle": "${new Date(
                        sessionStart.timestamp
                    ).toDateString()}",
                    "activityImage": "https://avatars1.githubusercontent.com/u/1478800?s=460&v=4",
                    "facts": [
                        {
                            "name": "Session:",
                            "value": "![](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=B8B6033309174F05E5167DFF814EF6FF8036)"
                        },
                        {
                            "name": "Repository:",
                            "value": "[mgarcia\\test](https://awesomedocument.com)"
                        }
                    ],
                    "text": "Working on creating the branch broadcast experience for Live Share."
                }
            ],
            "potentialAction": [
                {
                    "@type": "OpenUri",
                    "name": "Join the Session",
                    "targets": [
                        {
                            "os": "default",
                            "uri": "https://prod.liveshare.vsengsaas.visualstudio.com/join?B1A5D4B9A40317E0DE4D88CAB15BAC136FDE"
                        }
                    ]
                },
                {
                    "@type": "OpenUri",
                    "name": "Join in VSCode",
                    "targets": [
                        {
                            "os": "default",
                            "uri": "https://prod.liveshare.vsengsaas.visualstudio.com/join?B1A5D4B9A40317E0DE4D88CAB15BAC136FDE"
                        }
                    ]
                }
            ]
        }`;
    };
}
