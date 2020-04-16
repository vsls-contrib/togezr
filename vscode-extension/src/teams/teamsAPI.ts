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
    ): Promise<ITeamsChannelMessageResponse> => {
        const { token } = this.account;

        const res = await fetch(
            `https://graph.microsoft.com/beta/teams/${teamId}/channels/${channelId}/messages`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: message,
            }
        );

        if (!res.ok) {
            throw new Error(
                `Cannot send message to Teams team "${teamId}", channel "${channelId}".`
            );
        }

        return await res.json();
    };

    public addChannelMessageReply = async (
        teamId: string,
        channelId: string,
        messageId: string,
        message: string
    ): Promise<ITeamsChannelMessageResponse> => {
        const { token } = this.account;

        const res = await fetch(
            `https://graph.microsoft.com/beta/teams/${teamId}/channels/${channelId}/messages/${messageId}/replies`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: message,
            }
        );

        if (!res.ok) {
            throw new Error(`Cannot reply to the Teams message.`);
        }

        return await res.json();
    };
}
