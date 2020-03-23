import { TeamsAPI } from '../../teams/teamsAPI';
import { TeamsUsersTreeItem } from './TeamsUsersTreeItem';
import { TeamsUserTreeItem } from './TeamsUserTreeItem';

export const getTeamsUsers = async (element: TeamsUsersTreeItem) => {
    const { account } = element;
    const api = new TeamsAPI(account);
    const users = await api.getUsers();

    const userTreeItems = users.map((user) => {
        return new TeamsUserTreeItem(account, user);
    });

    return userTreeItems;
};
