import { ISessionEvent } from '../sessionConnectors/renderer/events';

export const emojiForEvent = (e: ISessionEvent) => {
    if (e.type === 'guest-join') {
        return '👋';
    }

    if (e.type === 'restart-session') {
        return '💫';
    }

    if (e.type === 'commit-push') {
        return '📌';
    }

    if (e.type === 'end-session') {
        return '🤗';
    }

    throw new Error(`Unknow event ${e.type}.`);
};
