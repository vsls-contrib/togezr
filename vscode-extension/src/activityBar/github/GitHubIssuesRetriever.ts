import { getGithubAPI } from '../../github/githubAPI';
import { IGitHubAccountRecord } from '../../interfaces/IAccountRecord';
import { IGithubRepo } from '../../interfaces/IGitHubRepo';
export class GitHubIssuesRetriever {
    // private issuesMap = new Map<string, IGithubIssueRecord>();
    public getIssues = async (
        account: IGitHubAccountRecord,
        repo: IGithubRepo
    ) => {
        const api = await getGithubAPI(account.name);
        const issuesResponse = await api.issues.listForRepo({
            owner: repo.owner.login,
            repo: repo.name,
            state: 'open',
            per_page: 100,
            sort: 'updated',
        });
        if (issuesResponse.status !== 200) {
            throw new Error(`Cannot get issues for the repo "${repo.name}".`);
        }
        return issuesResponse.data;
    };
}

export const gitHubIssuesRetriever = new GitHubIssuesRetriever();
