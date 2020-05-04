import { ITeamsAccountRecord } from '../../interfaces/IAccountRecord';
import { TeamsTeamsTreeItem } from './TeamsTeamsTreeItem';
import { TeamsUsersTreeItem } from './TeamsUsersTreeItem';

export const getTeamsAccountChildren = async (account: ITeamsAccountRecord) => {
    return [new TeamsUsersTreeItem(account), new TeamsTeamsTreeItem(account)];
};
