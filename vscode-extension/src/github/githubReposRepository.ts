import { IGithubRepo, IShortGithubRepo } from '../interfaces/IGitHubRepo';
import * as memento from '../memento';

const GITHUB_REPOS_REPOSITORY_MEMENTO_KEY = `togezr.repos.repository.memento.key`;

export interface IGithubAccountRepo {
    repo: IShortGithubRepo | IGithubRepo;
    accountName: string;
}

export class GithubReposRepository {
    private getKey = (accountName: string) => {
        return `${GITHUB_REPOS_REPOSITORY_MEMENTO_KEY}_${accountName}`;
    };

    public get = (accountName: string): IGithubAccountRepo[] => {
        const key = this.getKey(accountName);
        const records = memento.get<IGithubAccountRepo[]>(key);

        if (records) {
            return records;
        }

        return [];
    };

    public add = (
        accountName: string,
        repo: IShortGithubRepo | IGithubRepo
    ): boolean => {
        const key = this.getKey(accountName);

        const records = memento.get<IGithubAccountRepo[]>(key) || [];

        const currentElement = records.find((record) => {
            return record.repo.id === repo.id;
        });

        if (currentElement) {
            return false;
        }

        records.push({ accountName, repo });
        memento.set(key, records);

        return true;
    };

    public remove = (
        accountName: string,
        repo: IShortGithubRepo | IGithubRepo
    ): boolean => {
        const key = this.getKey(accountName);

        const currentRecords = memento.get<IGithubAccountRepo[]>(key) || [];

        const records = currentRecords.filter((record) => {
            return record.repo.id !== repo.id;
        });

        memento.set(key, records);

        return true;
    };
}

export const githubReposRepository = new GithubReposRepository();
