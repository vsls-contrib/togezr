import { ChannelSession } from '../../channels/ChannelSession';
import { TTeamsChannel } from '../../interfaces/TTeamsChannel';
import {
    ISessionEvent,
    ISessionStartEvent,
} from '../../sessionConnectors/renderer/events';
import { User } from '../../user';
import { renderCardFooterTeams } from './renderCardFooterTeams';
import { renderFactSetTeams } from './renderFactSetTeams';
import { renderGithubRepoInfoSectionTeams } from './renderGithubRepoInfoSectionTeams';

export const renderCommentTeams = async (
    events: ISessionEvent[],
    channel: TTeamsChannel,
    channels: ChannelSession[]
) => {
    const startEvent = events[0] as ISessionStartEvent;
    const host = new User(startEvent.user);

    const { sessionId } = startEvent;
    const lsSessionLink = `https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId}`;

    return {
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        type: 'AdaptiveCard',
        version: '1.0',
        body: [
            {
                type: 'Container',
                padding: 'None',
                spacing: 'None',
                items: [
                    {
                        type: 'Container',
                        padding: 'Medium',
                        items: [
                            {
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
                                                columns: [
                                                    {
                                                        type: 'Column',
                                                        padding: 'None',
                                                        width: 'auto',
                                                        items: [
                                                            {
                                                                type:
                                                                    'TextBlock',
                                                                text: `${host.displayName} started [Live Share session](${lsSessionLink}).`,
                                                                wrap: true,
                                                                spacing: 'None',
                                                            },
                                                        ],
                                                    },
                                                ],
                                                padding: 'None',
                                            },
                                        ],
                                        verticalContentAlignment: 'Center',
                                    },
                                ],
                                padding: 'None',
                            },
                            ...renderGithubRepoInfoSectionTeams(channels),
                            ...renderFactSetTeams(channels, lsSessionLink),
                        ],
                    },
                    {
                        ...(await renderCardFooterTeams(
                            events,
                            channels,
                            lsSessionLink
                        )),
                    },
                ],
            },
        ],
    };
};
