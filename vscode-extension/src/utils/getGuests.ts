import {
    ISessionEvent,
    ISessionStartEvent,
    ISessionUserJoinEvent,
} from '../sessionConnectors/renderer/events';

export const getGuests = (events: ISessionEvent[]) => {
    const guests = events.filter((e) => {
        return e.type === 'guest-join' || e.type === 'start-session';
    }) as (ISessionUserJoinEvent | ISessionStartEvent)[];

    return guests;
};
