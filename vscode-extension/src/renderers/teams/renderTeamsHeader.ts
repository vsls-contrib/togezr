import {
    ISessionEvent,
    ISessionStartEvent,
} from '../../sessionConnectors/renderer/events';
import { User } from '../../user';

export const renderTeamsHeader = async (events: ISessionEvent[]) => {
    const startEvent = events[0] as ISessionStartEvent;

    const host = new User(startEvent.user);

    return {
        '@type': 'MessageCard',
        '@context': 'https://schema.org/extensions',
        summary: `${host.displayName} started Live Share session`,
        title: `${host.displayName} started Live Share session`,
    };
};
