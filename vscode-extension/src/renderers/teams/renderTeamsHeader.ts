import { ISessionEvent } from '../../sessionConnectors/renderer/events';

export const renderTeamsHeader = async (events: ISessionEvent[]) => {
    return {
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        type: 'AdaptiveCard',
        version: '1.0',
    };
};
