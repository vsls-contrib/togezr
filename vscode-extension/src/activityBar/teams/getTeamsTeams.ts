import { teamsTeamsRepository } from '../../teams/teamsTeamsRepository';
import { TeamsTeamsTreeItem } from './TeamsTeamsTreeItem';
import { TeamsTeamTreeItem } from './TeamsTeamTreeItem';

export const getTeamsTeams = async (element: TeamsTeamsTreeItem) => {
    const { account } = element;
    const result = [];
    const teams = teamsTeamsRepository.get(account.name);
    for (let team of teams) {
        const teamsTeamTreeItem = new TeamsTeamTreeItem(team, account);
        result.push(teamsTeamTreeItem);
    }
    // if (result.length === 0) {
    //     result.push(new AccountAddMoreTreeItem('+ Add team...', element));
    // }
    return result;
};
