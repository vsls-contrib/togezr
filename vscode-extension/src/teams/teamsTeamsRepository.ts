import * as memento from '../memento';

const TEAMS_TEAMS_REPOSITORY_MEMENTO_KEY = `togezr.teams.repository.memento.key`;

export interface ITeamsTeam {
    id: string;
    description: string;
    displayName: string;
    isArchived: boolean;
    // classification: null;
    // discoverySettings: null;
    // funSettings: null;
    // guestSettings: null;
    // internalId: null;
    // memberSettings: null;
    // messagingSettings: null;
    // specialization: null;
    // visibility: null;
    // webUrl: null;
}

export class TeamsTeamsRepository {
    private getKey = (accountName: string) => {
        return `${TEAMS_TEAMS_REPOSITORY_MEMENTO_KEY}_${accountName}`;
    };

    public get = (accountName: string): ITeamsTeam[] => {
        const key = this.getKey(accountName);
        const records = memento.get<ITeamsTeam[]>(key);
        if (records) {
            return records;
        }
        return [];
    };

    public add = (accountName: string, team: ITeamsTeam): boolean => {
        const key = this.getKey(accountName);
        const records = memento.get<ITeamsTeam[]>(key) || [];

        const currentElement = records.find((record) => {
            return record.id === team.id;
        });

        if (currentElement) {
            return false;
        }

        records.push({ ...team });
        memento.set(key, records);

        return true;
    };

    // public remove = (accountName: string, repo: IGithubRepo): boolean => {
    //     // const key = this.getKey(accountName);
    //     // const currentRecords = memento.get<IGithubAccountRepo[]>(key) || [];
    //     // const records = currentRecords.filter((record) => {
    //     //     return record.repo.id !== repo.id;
    //     // });
    //     // memento.set(key, records);
    //     // return true;
    // };
}

export const teamsTeamsRepository = new TeamsTeamsRepository();
