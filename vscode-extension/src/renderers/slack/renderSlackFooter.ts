import {
    ISessionEvent,
    ISessionStartEvent,
} from '../../sessionConnectors/renderer/events';
import { SLACK_DIVIDER } from './slackDivider';

export const renderFooter = (events: ISessionEvent[]) => {
    const startEvent = events[0] as ISessionStartEvent;

    const endEvent = events.find((e) => {
        return e.type === 'end-session';
    });

    if (endEvent) {
        return [];
    }

    let text = 'Session Coming soon';
    if (startEvent) {
        const { sessionId } = startEvent;
        text = `<vscode://ms-vsliveshare.vsliveshare/join?${sessionId}|Join in VSCode> `;
    }

    return [
        SLACK_DIVIDER,
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*[ ${text} ]*\n\n`,
            },
        },
        SLACK_DIVIDER,
    ];
};
