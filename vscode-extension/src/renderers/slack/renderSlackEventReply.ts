import { ISessionEvent } from '../../sessionConnectors/renderer/events';
import { renderCommitPushEventReply } from './renderCommitPushEventReply';
import { renderGuestJoinEventReply } from './renderGuestJoinEventReply';
import { renderSessionEndEventReply } from './renderSessionEndEventReply';
import { renderSessionRestartReply } from './renderSessionRestartReply';

interface ISlackReplyMessagePayload {
    text: string;
    blocks: any[];
}

export const renderSlackEventReply = async (
    event: ISessionEvent,
    events: ISessionEvent[]
): Promise<ISlackReplyMessagePayload> => {
    if (event.type === 'restart-session') {
        return await renderSessionRestartReply(event, events);
    }

    if (event.type === 'guest-join') {
        return await renderGuestJoinEventReply(event);
    }

    if (event.type === 'commit-push') {
        return await renderCommitPushEventReply(event, events);
    }

    if (event.type === 'end-session') {
        return await renderSessionEndEventReply(event, events);
    }

    throw new Error('Unknown event.');
};
