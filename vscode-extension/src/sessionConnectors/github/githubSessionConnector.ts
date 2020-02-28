import fetch from 'node-fetch';
import * as vsls from 'vsls';
import { onCommitPushToRemote } from '../../branchBroadcast/git/onCommit';
import { ISessionConnector } from '../../branchBroadcast/interfaces/ISessionConnector';
import {
    getBranchRegistryRecord,
    IRegistryData,
} from '../../commands/registerBranch/branchRegistry';
import {
    connectorRepository,
    IGitHubConnector,
} from '../../connectorRepository/connectorRepository';
import { EXTENSION_NAME_LOWERCASE } from '../../constants';
import { IConnectorData } from '../../interfaces/IConnectorData';
import { IGithubConnectorData } from '../../interfaces/IGithubConnectorData';
import { IGitHubIssue } from '../../interfaces/IGitHubIssue';
import * as keytar from '../../keytar';
import { ISessionEvent } from '../renderer/events';
import { GithubCommentRenderer } from '../renderer/githubCommentRenderer';
import { getIssueOwner } from './getIssueOwner';
import { getIssueRepo } from './getIssueRepo';
import { getIssueTextWithDetailsGithub } from './getIssueTextWithDetailsGithub';
import { githubAvatarRepository } from './githubAvatarsRepository';

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

const getConnector = (connectorId: string): IGitHubConnector => {
    const connector = connectorRepository.getConnector(connectorId);

    if (!connector) {
        throw new Error('Connector not found.');
    }

    return connector as IGitHubConnector;
};

const getAuthToken = async (connectorId: string): Promise<string> => {
    const connector = getConnector(connectorId);

    const token = await keytar.get(connector.accessTokenKeytarKey);
    if (!token) {
        throw new Error('No token found');
    }

    return token;
};

const sendGithubRequest = async (
    token: string,
    url: string,
    method: 'GET' | 'POST' | 'PATCH',
    body?: object
) => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${token}`,
        },
    };
    if (body) {
        (options as any).body = JSON.stringify(body, null, 2);
    }
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
};

export const renderSessionDetails = async (registryData: IRegistryData) => {
    const { connectorsData } = registryData;
    const githubConnectorData = connectorsData.find((connector) => {
        return connector.type === 'GitHub';
    });

    if (!githubConnectorData) {
        throw new Error('No github connector data found');
    }

    const { githubIssue } = githubConnectorData.data as IGithubConnectorData;

    const url = `https://api.github.com/repos/${getIssueOwner(
        githubIssue.html_url
    )}/${getIssueRepo(githubIssue.html_url)}/issues/${githubIssue.number}`;

    const token = await getAuthToken(githubConnectorData.id);

    const issue = await sendGithubRequest(token, url, 'GET');

    const { body = '' } = issue;
    const labels: IGitHubIssueLabel[] = issue.labels || [];

    const togezrLabel = labels.find((label) => {
        return label.name === EXTENSION_NAME_LOWERCASE;
    });

    if (!togezrLabel) {
        labels.push(EXTENSION_NAME_LOWERCASE as any);
    }

    await sendGithubRequest(token, url, 'PATCH', {
        body: await getIssueTextWithDetailsGithub(
            body || '',
            registryData,
            githubIssue
        ),
        labels,
    });
};

export class GithubSessionConnector implements ISessionConnector {
    private sessionCommentUrl: string | undefined;

    private events: ISessionEvent[] = [];
    private renderer: GithubCommentRenderer;

    private isDisposed = false;

    private sessionStartTimestamp: number;

    get registryData() {
        const result = getBranchRegistryRecord(this.id);

        if (!result) {
            throw new Error(
                `No branch broadcast record found for "${this.id}".`
            );
        }

        return result;
    }

    constructor(
        private vslsAPI: vsls.LiveShare,
        private id: string,
        private connectorData: IConnectorData,
        connectorsData: IConnectorData[],
        registryData: IRegistryData
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
                commit,
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

            const connector = connectorRepository.getConnector(
                this.connectorData.id
            ) as IGitHubConnector | undefined;

            if (!connector) {
                throw new Error('No connector found.');
            }

            setTimeout(async () => {
                await Promise.all([
                    renderSessionDetails(this.registryData),
                    this.reportGuestJoined(user),
                ]);
            }, 10);
        });
    }

    public async init() {
        // const githubIssue: IGitHubIssue = this.connectorData.data.githubIssue;
        // const connector = getConnector(this.connectorData.id);

        await Promise.all([
            renderSessionDetails(this.registryData),
            this.renderSessionComment(),
        ]);

        return this;
    }

    public async dispose() {
        // const githubIssue: IGitHubIssue = this.connectorData.data.githubIssue;
        this.isDisposed = true;

        this.events.push({
            type: 'end-session',
            timestamp: Date.now(),
        });

        await Promise.all([
            this.renderSessionComment(),
            renderSessionDetails(this.registryData),
        ]);
    }

    private renderSessionComment = async () => {
        const githubIssue: IGitHubIssue = this.connectorData.data.githubIssue;
        const token = await getAuthToken(this.connectorData.id);

        // vscode://vs-msliveshare.vsliveshare/join?${sessionId}
        const ghBody = {
            body: await this.renderer.render(this.events),
        };

        if (!this.sessionCommentUrl) {
            const url = `https://api.github.com/repos/${getIssueOwner(
                githubIssue.html_url
            )}/${getIssueRepo(githubIssue.html_url)}/issues/${
                githubIssue.number
            }}/comments`;

            const res = await sendGithubRequest(token, url, 'POST', ghBody);

            this.sessionCommentUrl = res.url;

            if (!this.sessionCommentUrl) {
                throw new Error('No session comment created.');
            }
        } else {
            await sendGithubRequest(
                token,
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
