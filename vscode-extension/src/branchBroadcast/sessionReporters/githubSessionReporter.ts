import fetch from 'node-fetch';
import * as vsls from 'vsls';
import { getBranchRegistryRecord } from '../../commands/registerBranch/branchRegistry';
import { EXTENSION_NAME_LOWERCASE } from '../../constants';
import { IReporterData } from '../../interfaces/IReportersData';
import * as keytar from '../../keytar';
import { reporterRepository } from '../../reporterRepository/reporterRepository';
import { Repository } from '../../typings/git';
import { onCommitPushToRemote } from '../git/onCommit';
import { ISessionReporter } from '../interfaces/ISessionReporter';
import { getIssueId } from './getIssueId';
import { getIssueOwner } from './getIssueOwner';
import { getIssueRepo } from './getIssueRepo';
import { getIssueTextWithDetailsGithub } from './getIssueTextWithDetailsGithub';
import { githubAvatarRepository } from './githubAvatarsRepository';
import { ISessionEvent } from './renderer/events';
import { GithubCommentRenderer } from './renderer/githubCommentRenderer';

export const getGithubUsername = (guest: vsls.UserInfo): string | null => {
    return guest.userName || null;
};

export const getGithubAvatar = async (username: string) => {
    return await githubAvatarRepository.getAvatarFor(username);
};

interface IGitHubIssueLabel {
    id?: number;
    color: string;
    default?: boolean;
    description?: string | null;
    name: string;
    node_id?: string;
    url?: string;
}

export class GithubSessionReporter implements ISessionReporter {
    private sessionCommentUrl: string | undefined;

    private events: ISessionEvent[] = [];
    private renderer: GithubCommentRenderer;

    private isDisposed = false;

    private sessionStartTimestamp: number;

    get registryData() {
        const result = getBranchRegistryRecord(this.repoId, this.branchName);

        if (!result) {
            throw new Error(
                `No branch broadcast record found for "${this.repoId} / ${this.branchName}".`
            );
        }

        return result;
    }

    constructor(
        private vslsAPI: vsls.LiveShare,
        private repoId: string,
        private branchName: string,
        private repo: Repository,
        private reporterData: IReporterData
    ) {
        this.sessionStartTimestamp = Date.now();
        this.renderer = new GithubCommentRenderer(this.sessionStartTimestamp);

        const { session } = vslsAPI;
        if (!session.id || !session.user) {
            throw new Error('No LiveShare session found.');
        }

        this.events.push({
            type: 'start-session',
            timestamp: Date.now(),
            sessionId: session.id,
            user: session.user,
        });

        onCommitPushToRemote(async ([commit, repoUrl]) => {
            if (this.isDisposed) {
                return;
            }

            this.events.push({
                type: 'commit-push',
                commitId: commit.hash,
                commitMessage: commit.message,
                timestamp: Date.now(),
                repoUrl,
            });

            await this.renderSessionComment();
        });

        this.vslsAPI.onDidChangePeers(async (e: vsls.PeersChangeEvent) => {
            if (this.isDisposed) {
                return;
            }

            if (e.removed.length) {
                return;
            }

            const userAdded = e.added[0];
            const { user } = userAdded;

            if (!user || !user.id) {
                throw new Error('User not found or joined without id.');
            }

            setTimeout(async () => {
                await Promise.all([
                    this.renderSessionDetails(),
                    this.reportGuestJoined(user),
                ]);
            }, 10);
        });
    }

    public async init() {
        await Promise.all([
            this.renderSessionDetails(),
            this.renderSessionComment(),
        ]);

        return this;
    }

    public async dispose() {
        this.isDisposed = true;

        this.events.push({
            type: 'end-session',
            timestamp: Date.now(),
        });

        await Promise.all([
            this.renderSessionComment(),
            this.renderSessionDetails(),
        ]);
    }

    getAuthToken = async (): Promise<string | null> => {
        const id = this.reporterData.id;
        const reporter = reporterRepository.getReporter(id);

        if (!reporter) {
            throw new Error(`No reporter found.`);
        }

        return await keytar.get(reporter.accessTokenKeytarKey);
    };

    private sendGithubRequest = async (
        url: string,
        method: 'GET' | 'POST' | 'PATCH',
        body?: object
    ) => {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${await this.getAuthToken()}`,
            },
        };
        if (body) {
            (options as any).body = JSON.stringify(body, null, 2);
        }
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    };

    private renderSessionDetails = async () => {
        const { githubIssue } = this.reporterData.data;

        const url = `https://api.github.com/repos/${getIssueOwner(
            githubIssue
        )}/${getIssueRepo(githubIssue)}/issues/${getIssueId(githubIssue)}`;

        const issue = await this.sendGithubRequest(url, 'GET');

        const { body = '' } = issue;
        const labels: IGitHubIssueLabel[] = issue.labels || [];

        const togezrLabel = labels.find((label) => {
            return label.name === EXTENSION_NAME_LOWERCASE;
        });

        if (!togezrLabel) {
            labels.push(EXTENSION_NAME_LOWERCASE as any);
        }

        const issueDetailsUpdateUrl = `https://api.github.com/repos/${getIssueOwner(
            githubIssue
        )}/${getIssueRepo(githubIssue)}/issues/${getIssueId(githubIssue)}`;

        await this.sendGithubRequest(issueDetailsUpdateUrl, 'PATCH', {
            body: await getIssueTextWithDetailsGithub(
                body || '',
                this.registryData,
                this.repo
            ),
            labels,
        });
    };

    private renderSessionComment = async () => {
        const { githubIssue } = this.reporterData.data;

        // vscode://vs-msliveshare.vsliveshare/join?${sessionId}
        const ghBody = {
            body: await this.renderer.render(this.events),
        };

        if (!this.sessionCommentUrl) {
            const url = `https://api.github.com/repos/${getIssueOwner(
                githubIssue
            )}/${getIssueRepo(githubIssue)}/issues/${getIssueId(
                githubIssue
            )}/comments`;

            const res = await this.sendGithubRequest(url, 'POST', ghBody);

            this.sessionCommentUrl = res.url;

            if (!this.sessionCommentUrl) {
                throw new Error('No session comment created.');
            }
        } else {
            await this.sendGithubRequest(
                this.sessionCommentUrl,
                'PATCH',
                ghBody
            );
        }
    };

    private reportGuestJoined = async (guest: vsls.UserInfo) => {
        const isGuestInSession = this.events.find((event) => {
            if (event.type !== 'guest-join') {
                return;
            }

            return event.user.id === guest.id;
        });

        if (isGuestInSession) {
            return;
        }

        this.events.push({
            type: 'guest-join',
            user: guest,
            timestamp: Date.now(),
        });

        await this.renderSessionComment();
    };
}
