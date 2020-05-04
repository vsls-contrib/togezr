import * as vscode from 'vscode';
import { refreshActivityBar } from '../../activityBar/activityBar';
import { CancellationError } from '../../errors/CancellationError';
import { ITeamsAccountRecord } from '../../interfaces/IAccountRecord';
import { TeamsAPI } from '../../teams/teamsAPI';
import { teamsTeamsRepository } from '../../teams/teamsTeamsRepository';

export const addTeamsAccountEntityCommand = async (
    account: ITeamsAccountRecord
) => {
    const api = new TeamsAPI(account);
    const teams = await api.getUserJoinedTeams();
    const options = teams.map((team) => {
        return {
            label: team.displayName,
            description: team.description,
            team,
        };
    });
    const answer = await vscode.window.showQuickPick(options, {
        placeHolder: 'Select team',
        ignoreFocusOut: true,
    });
    if (!answer) {
        throw new CancellationError('No team selected.');
    }
    teamsTeamsRepository.add(account.name, answer.team);
    refreshActivityBar();
    await vscode.window.showInformationMessage(
        `"${answer.team.displayName}" team added.`
    );
};
