const time = require('pretty-ms');
import {
    ISessionEvent,
    ISessionStartEvent,
} from '../../sessionConnectors/renderer/events';

export const renderSessionRestartReply = (
    event: ISessionStartEvent,
    events: ISessionEvent[]
) => {
    const sessionStartEvent = events[0] as ISessionStartEvent;
    const timeDelta = event.timestamp - sessionStartEvent.timestamp;
    const lsSessionUrl = `https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionStartEvent.sessionId}`;

    return {
        text: `LiveShare session restarted.`,
        blocks: [
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: `💫 <${lsSessionUrl}|Live Share session> restarted (${time(
                            timeDelta
                        )})`,
                    },
                ],
            },
        ],
    };
};
