import { ChannelSession } from '../../channels/ChannelSession';
import {
    ISessionEvent,
    ISessionStartEvent,
} from '../../sessionConnectors/renderer/events';

export const renderTeamsFooter = async (
    events: ISessionEvent[],
    channels: ChannelSession[]
) => {
    const startEvent = events[0] as ISessionStartEvent;

    const { sessionId } = startEvent;
    const lsSessionLink = `https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId}`;
    return {
        potentialAction: [
            {
                '@type': 'OpenUri',
                name: 'Join the Session',
                targets: [
                    {
                        os: 'default',
                        uri: `${lsSessionLink}`,
                    },
                ],
            },
        ],
    };
};
