import fetch from 'node-fetch';
import * as vsls from 'vsls';
import { onCommitPushToRemote } from '../../branchBroadcast/git/onCommit';
import { ISessionConnector } from '../../branchBroadcast/interfaces/ISessionConnector';
import { getBranchRegistryRecord } from '../../commands/registerBranch/branchRegistry';
import { connectorRepository } from '../../connectorRepository/connectorRepository';
import { IConnectorData } from '../../interfaces/IConnectorData';
import { ISlackChannel } from '../../interfaces/ISlackChannel';
import * as keytar from '../../keytar';
import { SlackCommentRenderer } from '../../sessionConnectors/renderer/slackCommentRenderer';
import { Repository } from '../../typings/git';
import { ISessionEvent } from '../renderer/events';

export class SlackSessionConnector implements ISessionConnector {
    private sessionStartTimestamp: number;

    private isDisposed = false;

    private sessionCommentUrl: any | undefined;

    private events: ISessionEvent[] = [];
    private renderer: SlackCommentRenderer;

    private getAuthToken = async (): Promise<string | null> => {
        const id = this.connectorData.id;
        const connector = connectorRepository.getConnector(id);

        if (!connector) {
            throw new Error(`No connector found.`);
        }

        return await keytar.get(connector.accessTokenKeytarKey);
    };

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
        repo: Repository,
        private connectorData: IConnectorData,
        connectorsData: IConnectorData[]
    ) {
        this.sessionStartTimestamp = Date.now();

        const githubConnector = connectorsData.find((connectorData) => {
            return connectorData.type === 'GitHub';
        });

        // TODO: get issue info
        this.renderer = new SlackCommentRenderer(githubConnector);

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
                    // this.renderSessionDetails(),
                    this.reportGuestJoined(user),
                ]);
            }, 10);
        });
    }

    public init = async () => {
        await Promise.all([
            // this.renderSessionDetails(),
            this.renderSessionComment(),
        ]);

        return this;
    };

    public dispose = async () => {
        this.isDisposed = true;

        this.events.push({
            type: 'end-session',
            timestamp: Date.now(),
        });

        await Promise.all([
            this.renderSessionComment(),
            // this.renderSessionDetails(),
        ]);
    };

    private renderSessionComment = async () => {
        const { channel } = this.connectorData.data as {
            channel: ISlackChannel;
            channelConnectionName: string;
        };

        if (!this.sessionCommentUrl) {
            const body = await this.renderer.render(
                this.events,
                channel,
                this.sessionCommentUrl && (this.sessionCommentUrl as any).ts
            );

            const result = await fetch(
                'https://slack.com/api/chat.postMessage',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${await this.getAuthToken()}`,
                    },
                    body,
                }
            );

            const bodyJSON = await result.json();

            if (bodyJSON.ok === false) {
                throw new Error('Slack request failed.');
            }
            // https://avatars1.githubusercontent.com/u/1478800?s=460&v=4
            this.sessionCommentUrl = bodyJSON;
        } else {
        }
    };

    // private renderSessionDetails = async () => {};

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

    // private render(threadTs?: string) {
    //     const guests: ISessionGuest[] = this.guests.map((guest) => {
    //         return {
    //             name: guest.name,
    //             imageUrl:
    //                 'https://avatars1.githubusercontent.com/u/1478800?s=460&v=4',
    //         };
    //     });
    //     const result = template({
    //         registryData: this.registryData,
    //         // channelId: this.registryData.channel.url,
    //         authorUserName: 'Oleg Solomka',
    //         authorUserId: 'fakeLink.toUser.com',
    //         // liveshareSessionId: this.registryData.sessionId,
    //         guests,
    //         threadTs,
    //     });
    //     return result;
    // }

    // public async reportSessionStart() {
    //     const payload = this.render();
    //     const result = await fetch('https://slack.com/api/chat.postMessage', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${SLACK_BEARER_TOKEN}`,
    //         },
    //         body: payload,
    //     });
    //     const body: IMessageRessponeData = await result.json();
    //     this.messageData = body;
    // }

    // public async reportSessionGuest(guest: IGuest) {
    //     if (!this.messageData) {
    //         throw new Error('No send the message first!');
    //     }
    //     this.guests.push(guest);
    //     const payload = this.render(this.messageData.ts);
    //     const result = await fetch('https://slack.com/api/chat.update', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${SLACK_BEARER_TOKEN}`,
    //         },
    //         body: payload,
    //     });
    //     const res = await result.json();
    //     console.log(res);
    // }
}
