const time = require('pretty-ms');
import { emojiForEvent } from '../../emoji/eventToEmojiMap';
import {
    ISessionEndEvent,
    ISessionEvent,
    ISessionStartEvent,
} from '../../sessionConnectors/renderer/events';
export const renderSessionEndEventReply = async (
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
                        text: `Session ended. (${time(
                            timeDelta
                        )}) ${emojiForEvent(event)} `,
                    },
                ],
            },
        ],
    };
};
