import { TeamsAPI } from '../../teams/teamsAPI';
import { TeamsChannelTreeItem } from './TeamsChannelTreeItem';
import { TeamsTeamTreeItem } from './TeamsTeamTreeItem';

export const getTeamsChannels = async (element: TeamsTeamTreeItem) => {
    const { team, account } = element;
    const api = new TeamsAPI(account);

    const channels = await api.getTeamChannels(team);
    const channelTreeItems = channels.map((channel) => {
        return new TeamsChannelTreeItem(team, channel, account);
    });

    return channelTreeItems;
};
