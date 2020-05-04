import { ISessionEvent } from '../../sessionConnectors/renderer/events';
import { getUserEvents } from '../../utils/getUserEvents';
import { renderUserTeams } from './renderUserTeams';
export const renderUsersTeams = async (events: ISessionEvent[]) => {
    const guests = getUserEvents(events);
    const clampedGuests = guests.slice(0, 4);
    const renderedGuestsPromises: any[] = clampedGuests.map(async (guest) => {
        return await renderUserTeams(guest);
    });
    const renderedGuests = await Promise.all(renderedGuestsPromises);
    const suffix = guests.length === 1 ? '' : 's';
    const guestText = `${guests.length} guest${suffix}`;
    renderedGuests.push({
        type: 'Column',
        padding: 'None',
        width: 'stretch',
        items: [
            {
                type: 'TextBlock',
                text: guestText,
                wrap: true,
                weight: 'Bolder',
                horizontalAlignment: 'Left',
                spacing: 'None',
            },
        ],
        verticalContentAlignment: 'Center',
    });
    return renderedGuests;
};
