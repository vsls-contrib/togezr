import * as vscode from 'vscode';
import { lsApi, startLSSession } from '../../../branchBroadcast/liveshare';
import { GitHubChannelSession } from '../../../channels/GitHubChannelSession';
import { getGithubAPI } from '../../../github/githubAPI';
import { githubReposRepository } from '../../../github/githubReposRepository';
import { getIssueRepo } from '../../../sessionConnectors/github/getIssueRepo';
import { sleepAsync } from '../../../utils/sleepAsync';
import { IGitHubAccountRecord } from '../../IAccountRecord';
import { IShortGitHubIssue } from '../../IShortGitHubIssue';
import { TGitHubChannel } from '../../TGitHubChannel';

export interface IAccount {
    login: string;
    name?: string;
    avatarUrl?: string;
    url: string;
}

// export interface IGithubRepository {}

interface IGHPRGithubIssue {
    id: string;
    number: number;
    html_url: string;
    author: IAccount;
}

type TKnownEvents = 'start-working-on-issue' | 'stop-working-on-issue';

interface IEventBase {
    type: TKnownEvents;
}

interface IStartWorkingOnIssueEvent extends IEventBase {
    type: 'start-working-on-issue';
    issue: IGHPRGithubIssue;
}

interface IStopWorkingOnIssueEvent extends IEventBase {
    type: 'stop-working-on-issue';
    issue: IGHPRGithubIssue;
}

export type TGithubPrExtensionEvents =
    | IStartWorkingOnIssueEvent
    | IStopWorkingOnIssueEvent;

interface IGithubPrApi {
    onEvent: (listener: (ev: TGithubPrExtensionEvents) => any) => void;
}

const ACCOUNT_KEY = 'github.pullrequest.integration.account';

export class GithubPRIntegration {
    private githubPrExtension?: IGithubPrApi;
    private account?: IGitHubAccountRecord;

    private ensureAccount = async (githubPrIssue?: IGHPRGithubIssue) => {
        // const [token, account] = await Promise.all([
        //     auth.getCachedGithubPullRequestToken(),
        //     accountsKeychain.getAccount(ACCOUNT_KEY),
        // ]);
        // const tokenToSet = token ? token : account?.token;
        // if (!tokenToSet) {
        //     return;
        // }
        // this.account = {
        //     type: 'GitHub',
        //     name: ACCOUNT_KEY,
        //     token: tokenToSet,
        // };
        // await accountsKeychain.updateAccount(this.account);
        // const repos = githubReposRepository.get(ACCOUNT_KEY);
        // const repo = repos.find((r) => {
        //     return r.repo.id === getCurrentRepoId();
        // });
        // if (repo || !githubPrIssue) {
        //     return;
        // }
        // const api = await getGithubAPI(this.account.name);
        // console.log(
        //     githubPrIssue.author.login,
        //     getIssueRepo(githubPrIssue.html_url)
        // );
        // const repoResponse = await api.repos.get({
        //     owner: githubPrIssue.author.login,
        //     repo: getIssueRepo(githubPrIssue.html_url),
        // });
        // const repoData = repoResponse.data as IShortGithubRepo;
        // githubReposRepository.add(ACCOUNT_KEY, repoData);
    };

    public init = async () => {
        const githubPrExtensionExport = vscode.extensions.getExtension(
            'github.vscode-pull-request-github'
        );

        if (githubPrExtensionExport) {
            // TODO: add timeout
            while (!githubPrExtensionExport.isActive) {
                await sleepAsync(500);
            }

            this.setupListeners(githubPrExtensionExport.exports);
        }

        await this.ensureAccount();
    };

    private setupListeners = (api: IGithubPrApi) => {
        this.githubPrExtension = api;

        this.githubPrExtension.onEvent(async (ev) => {
            switch (ev.type) {
                case 'start-working-on-issue': {
                    return await this.onStartWorkingOnIssue(ev.issue);
                }

                case 'stop-working-on-issue': {
                    return await this.onStopWorkingOnIssue(ev.issue);
                }
            }
        });
    };

    private onStartWorkingOnIssue = async (githubPrIssue: IGHPRGithubIssue) => {
        await this.ensureAccount(githubPrIssue);

        if (!this.account) {
            return;
        }

        const api = await getGithubAPI(this.account.name);

        const repoName = getIssueRepo(githubPrIssue.html_url);

        const issueResponse = await api.issues.get({
            owner: githubPrIssue.author.login,
            issue_number: githubPrIssue.number,
            repo: repoName,
        });

        const issue = issueResponse.data as IShortGitHubIssue;

        const repos = githubReposRepository.get(ACCOUNT_KEY);
        const repo = repos.find((r) => {
            return r.repo.name === repoName;
        });

        if (!repo) {
            throw new Error('No repo found.');
        }

        const gitHubChannel: TGitHubChannel = {
            type: 'github-issue',
            repo: repo.repo,
            issue,
            account: this.account,
        };

        const lsAPI = lsApi();
        const session = new GitHubChannelSession(gitHubChannel, [], lsAPI);
        await startLSSession(true, session.sessionId);
        await session.init();
    };

    private onStopWorkingOnIssue = (issue: IGHPRGithubIssue) => {};
}
