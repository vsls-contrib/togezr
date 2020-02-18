import fetch from 'node-fetch';
import * as vsls from 'vsls';
import { onCommitPushToRemote } from '../../branchBroadcast/git/onCommit';
import { ISessionConnector } from '../../branchBroadcast/interfaces/ISessionConnector';
import { getBranchRegistryRecord } from '../../commands/registerBranch/branchRegistry';
import {
    connectorRepository,
    IGitHubConnector,
    ITeamsConnector,
} from '../../connectorRepository/connectorRepository';
import { IConnectorData } from '../../interfaces/IConnectorData';
import { Repository } from '../../typings/git';
import {
    ISessionCommitPushEvent,
    ISessionEndEvent,
    ISessionEvent,
    ISessionUserJoinEvent,
} from '../renderer/events';
import { TeamsCommentRenderer } from '../renderer/teamsCommentRenderer';

export class TeamsSessionConnector implements ISessionConnector {
    private sessionStartTimestamp: number;

    private isDisposed = false;

    private events: ISessionEvent[] = [];
    private renderer: TeamsCommentRenderer;

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
        repo: Repository,
        private connectorData: IConnectorData,
        connectorsData: IConnectorData[]
    ) {
        this.sessionStartTimestamp = Date.now();

        const githubConnector = connectorsData.find((connectorData) => {
            return connectorData.type === 'GitHub';
        }) as IGitHubConnector;

        this.renderer = new TeamsCommentRenderer(
            this.registryData,
            githubConnector
        );

        const { session } = vslsAPI;
        if (!session.id || !session.user) {
            throw new Error('No LiveShare session found.');
        }

        this.events.push({
            type: 'start-session',
            timestamp: this.sessionStartTimestamp,
            sessionId: session.id,
            user: session.user,
        });

        onCommitPushToRemote(async ([commit, repoUrl]) => {
            if (this.isDisposed) {
                return;
            }

            const event: ISessionCommitPushEvent = {
                type: 'commit-push',
                commit,
                repoUrl,
                timestamp: Date.now(),
            };

            this.events.push(event);
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

            const event: ISessionUserJoinEvent = {
                type: 'guest-join',
                user,
                timestamp: Date.now(),
            };

            this.events.push(event);
        });
    }

    public init = async () => {
        await this.renderSessionComment();

        return this;
    };

    public dispose = async () => {
        this.isDisposed = true;

        const event: ISessionEndEvent = {
            type: 'end-session',
            timestamp: Date.now(),
        };

        this.events.push(event);
    };

    private renderSessionComment = async () => {
        const payload = await this.renderer.render(this.events);

        const connector = connectorRepository.getConnector(
            this.connectorData.id
        ) as ITeamsConnector;

        if (!connector || !connector.webHookUrl) {
            throw new Error('No connector found or webhookUrl set on one.');
        }

        const result = await fetch(connector.webHookUrl, {
            method: 'POST',
            body: payload,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        result;
    };
}
