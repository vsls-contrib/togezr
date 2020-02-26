import fetch from 'node-fetch';
import * as vsls from 'vsls';
import { onCommitPushToRemote } from '../../branchBroadcast/git/onCommit';
import { ISessionConnector } from '../../branchBroadcast/interfaces/ISessionConnector';
import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
import {
    connectorRepository,
    IGitHubConnector,
} from '../../connectorRepository/connectorRepository';
import { IConnectorData } from '../../interfaces/IConnectorData';
import { ISlackChannel } from '../../interfaces/ISlackChannel';
import { ISlackConnectionData } from '../../interfaces/ISlackConnectionData';
import * as keytar from '../../keytar';
import { SlackCommentRenderer } from '../../sessionConnectors/renderer/slackCommentRenderer';
import { Repository } from '../../typings/git';
import {
    ISessionCommitPushEvent,
    ISessionEndEvent,
    ISessionEvent,
    ISessionUserJoinEvent,
} from '../renderer/events';

const getAuthToken = async (connectorId: string): Promise<string | null> => {
    const connector = connectorRepository.getConnector(connectorId);

    if (!connector) {
        throw new Error(`No connector found.`);
    }

    return await keytar.get(connector.accessTokenKeytarKey);
};

export const renderBranchConnectedMessageSlack = async (
    registryData: IRegistryData
) => {
    const slackConnectorData = registryData.connectorsData.find((connector) => {
        return connector.type === 'Slack';
    });

    if (!slackConnectorData) {
        throw new Error('No Slack connector found.');
    }

    const { channel } = slackConnectorData.data as ISlackConnectionData;

    const githubConnector = registryData.connectorsData.find(
        (connectorData) => {
            return connectorData.type === 'GitHub';
        }
    ) as IGitHubConnector;

    const renderer = new SlackCommentRenderer(registryData, githubConnector);

    const ts = undefined;
    const body = await renderer.render([], channel);

    const url = !ts
        ? 'https://slack.com/api/chat.postMessage'
        : 'https://slack.com/api/chat.update';

    const result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getAuthToken(
                slackConnectorData.id
            )}`,
        },
        body,
    });

    const bodyJSON = await result.json();

    if (bodyJSON.ok === false) {
        throw new Error('Slack request failed.');
    }

    // this.sessionCommentUrl = bodyJSON;
};

export class SlackSessionConnector implements ISessionConnector {
    private sessionStartTimestamp: number;

    private isDisposed = false;

    private sessionCommentUrl: any | undefined;

    private events: ISessionEvent[] = [];
    private renderer: SlackCommentRenderer;

    constructor(
        private vslsAPI: vsls.LiveShare,
        id: string,
        private connectorData: IConnectorData,
        connectorsData: IConnectorData[],
        registryData: IRegistryData,
        repo?: Repository
    ) {
        this.sessionStartTimestamp = Date.now();

        const githubConnector = connectorsData.find((connectorData) => {
            return connectorData.type === 'GitHub';
        }) as IGitHubConnector;

        this.renderer = new SlackCommentRenderer(registryData, githubConnector);

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

            await Promise.all([
                this.sendSlackEvent(event),
                this.renderSessionComment(),
            ]);
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
                await this.reportGuestJoined(user);
            }, 10);
        });
    }

    public init = async () => {
        await Promise.all([this.renderSessionComment()]);

        return this;
    };

    public dispose = async () => {
        this.isDisposed = true;

        const event: ISessionEndEvent = {
            type: 'end-session',
            timestamp: Date.now(),
        };

        this.events.push(event);

        await Promise.all([
            this.sendSlackEvent(event),
            this.renderSessionComment(),
        ]);

        await Promise.all([this.renderSessionComment()]);
    };

    private renderSessionComment = async () => {
        const { channel } = this.connectorData.data as ISlackConnectionData;

        const ts = this.sessionCommentUrl && (this.sessionCommentUrl as any).ts;
        const body = await this.renderer.render(this.events, channel, ts);

        const url = !ts
            ? 'https://slack.com/api/chat.postMessage'
            : 'https://slack.com/api/chat.update';

        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getAuthToken(
                    this.connectorData.id
                )}`,
            },
            body,
        });

        const bodyJSON = await result.json();

        if (bodyJSON.ok === false) {
            throw new Error('Slack request failed.');
        }

        this.sessionCommentUrl = bodyJSON;
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

        const event: ISessionUserJoinEvent = {
            type: 'guest-join',
            user: guest,
            timestamp: Date.now(),
        };

        this.events.push(event);

        await Promise.all([
            this.sendSlackEvent(event),
            this.renderSessionComment(),
        ]);
    };

    private sendSlackEvent = async (
        event:
            | ISessionUserJoinEvent
            | ISessionCommitPushEvent
            | ISessionEndEvent
    ) => {
        if (!this.sessionCommentUrl) {
            throw new Error('Send the message first.');
        }

        const { channel } = this.connectorData.data as {
            channel: ISlackChannel;
            channelConnectionName: string;
        };

        const result = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getAuthToken(
                    this.connectorData.id
                )}`,
            },
            body: JSON.stringify(
                {
                    channel: channel.id,
                    thread_ts: (this.sessionCommentUrl as any).ts,
                    ...(await this.renderer.renderEvent(event, this.events)),
                },
                null,
                4
            ),
        });

        const res = await result.json();
        if (!res.ok) {
            throw new Error(`Slack API request failed.`);
        }
    };
}
