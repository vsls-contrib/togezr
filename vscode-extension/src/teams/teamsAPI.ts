import fetch from 'node-fetch';
import { ITeamsAccountRecord } from '../interfaces/IAccountRecord';
import { ITeamsChannel } from '../interfaces/ITeamsChannel';
import { ITeamsUser } from '../interfaces/ITeamsUser';
import { ITeamsTeam } from './teamsTeamsRepository';

export class TeamsAPI {
    constructor(private account: ITeamsAccountRecord) {}

    public getUserJoinedTeams = async () => {
        const { token } = this.account;

        const res = await fetch(
            'https://graph.microsoft.com/v1.0/me/joinedTeams',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }
        );

        if (!res.ok) {
            throw new Error(
                `Cannot get teams for the account "${this.account.name}".`
            );
        }

        const json = await res.json();

        const teams = json.value as ITeamsTeam[];
        return teams;
    };

    public getTeamChannels = async (team: ITeamsTeam) => {
        const { token } = this.account;

        const res = await fetch(
            `https://graph.microsoft.com/v1.0/teams/${team.id}/channels`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }
        );

        if (!res.ok) {
            throw new Error(
                `Cannot get channels for the team "${team.displayName}".`
            );
        }

        const json = await res.json();

        const channels = json.value as ITeamsChannel[];
        return channels;
    };

    public getUsers = async (count: number) => {
        const { token } = this.account;

        const res = await fetch(
            `https://graph.microsoft.com/v1.0/me/people?$top=${count}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            }
        );

        if (!res.ok) {
            throw new Error(
                `Cannot get users for the account "${this.account.name}".`
            );
        }

        const json = await res.json();

        const users = json.value as ITeamsUser[];
        return users;
    };

    public sendChannelMessage = async (
        teamId: string,
        channelId: string,
        message: string
    ) => {
        const { token } = this.account;

        const res = await fetch(
            `https://graph.microsoft.com/beta/teams/${teamId}/channels/${channelId}/messages`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                body: message,
            }
        );

        if (!res.ok) {
            const rs = await res.json();

            console.log(rs);

            throw new Error(
                `Cannot send message to Teams team "${teamId}", channel "${channelId}".`
            );
        }

        const json = await res.json();

        const users = json.value as ITeamsUser[];
        return users;
    };
}

// const cache = new Map<string, TeamsAPI>();

// export const getGithubAPI = async (accountName: string) => {
//     const existingApi = cache.get(accountName);

//     if (existingApi) {
//         return existingApi;
//     }

//     const account = await accountsKeychain.getAccount(accountName);
//     if (!account) {
//         throw new Error(`No account "${accountName}" found.`);
//     }

//     const webApi = new TeamsAPI(account);
//     cache.set(accountName, webApi);

//     return webApi;
// };
