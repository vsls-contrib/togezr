import { ChannelSession } from '../../channels/ChannelSession';
import { ISessionEvent } from '../../sessionConnectors/renderer/events';
import { renderUsersTeams } from './renderUsersTeams';
export const renderCardFooterTeams = async (
    events: ISessionEvent[],
    channels: ChannelSession[],
    lsSessionLink: string
) => {
    return {
        type: 'ColumnSet',
        columns: [
            {
                type: 'Column',
                padding: 'None',
                width: 'stretch',
                horizontalAlignment: 'Right',
                items: [
                    {
                        type: 'ColumnSet',
                        columns: [...(await renderUsersTeams(events))],
                        padding: 'None',
                        spacing: 'Small',
                    },
                ],
                verticalContentAlignment: 'Center',
            },
            {
                type: 'Column',
                padding: 'None',
                width: 'auto',
                items: [
                    {
                        type: 'ActionSet',
                        actions: [
                            {
                                type: 'Action.OpenUrl',
                                title: '◉ Join Session',
                                url: lsSessionLink,
                                style: 'positive',
                                isPrimary: true,
                            },
                        ],
                        horizontalAlignment: 'Center',
                    },
                ],
                horizontalAlignment: 'Left',
                verticalContentAlignment: 'Center',
            },
        ],
        padding: 'Default',
        style: 'emphasis',
    };
};
