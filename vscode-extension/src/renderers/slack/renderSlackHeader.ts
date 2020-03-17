import {
    ISessionEvent,
    ISessionStartEvent,
} from '../../sessionConnectors/renderer/events';
import { SLACK_DIVIDER } from './slackDivider';

export const renderHostHeader = (events: ISessionEvent[]) => {
    const startEvent = events[0] as ISessionStartEvent;
    const endEvent = events.find((e) => {
        return e.type === 'end-session';
    });
    let middleSection: any = {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text: 'User connected a feature branch to this channel.',
        },
    };

    if (startEvent) {
        const { user, sessionId } = startEvent;
        const statusText = endEvent ? 'Offline' : '⚡ Live';
        middleSection = {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `<https://github.com/${user.userName}|${user.displayName}> started <vscode://ms-vsliveshare.vsliveshare/join?${sessionId}|LiveShare session>.`,
            },
            accessory: {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: `${statusText}`,
                    emoji: true,
                },
            },
        };
    }

    return [SLACK_DIVIDER, middleSection, SLACK_DIVIDER];
};
