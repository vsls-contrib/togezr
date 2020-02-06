import fetch from 'node-fetch';
import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
import { ISessionGuest, template } from './template';

interface IGuest {
    name: string;
    email: string;
    id: string;
}

interface IMessageRessponeData {
    ok: boolean;
    channel: string;
    ts: string;
}

const SLACK_BEARER_TOKEN =
    'xoxb-932355612199-930042236820-igj4MJcEVO6GYFBFmxfdYLTq';
const GITHUB_BEARER_TOKEN = 'c2c7dea327f0643957242795816502b58382f7dc';

export class SlackSession {
    private messageData: IMessageRessponeData | undefined;
    private guests: IGuest[] = [];

    constructor(private registryData: IRegistryData) {}

    private render(threadTs?: string) {
        const guests: ISessionGuest[] = this.guests.map((guest) => {
            return {
                name: guest.name,
                imageUrl:
                    'https://avatars1.githubusercontent.com/u/1478800?s=460&v=4',
            };
        });
        const result = template({
            registryData: this.registryData,
            // channelId: this.registryData.channel.url,
            authorUserName: 'Oleg Solomka',
            authorUserId: 'fakeLink.toUser.com',
            // liveshareSessionId: this.registryData.sessionId,
            guests,
            threadTs,
        });

        return result;
    }

    public async sendMesage() {
        const payload = this.render();

        const result = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${SLACK_BEARER_TOKEN}`,
            },
            body: payload,
        });

        const body: IMessageRessponeData = await result.json();

        this.messageData = body;

        const ghBody = {
            body: `[Oleg Solomka](https://github.com/legomushroom) started a [Live Share session](vscode://vs-msliveshare.vsliveshare/join?${this.registryData.sessionId}).`,
        };

        const ghResult = await fetch(
            'https://api.github.com/repos/legomushroom/liveshare-teams/issues/1/comments',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `token ${GITHUB_BEARER_TOKEN}`,
                },
                body: JSON.stringify(ghBody, null, 2),
            }
        );

        console.log(ghResult);
    }

    public async addGuest(guest: IGuest) {
        if (!this.messageData) {
            throw new Error('No send the message first!');
        }

        this.guests.push(guest);

        const payload = this.render(this.messageData.ts);

        const result = await fetch('https://slack.com/api/chat.update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${SLACK_BEARER_TOKEN}`,
            },
            body: payload,
        });

        const res = await result.json();

        console.log(res);
    }
}

let currentSession: SlackSession | undefined;
export const startSession = (registryData: IRegistryData) => {
    currentSession = new SlackSession(registryData);

    return currentSession;
};

export const stopSession = (registryData: IRegistryData) => {
    currentSession = undefined;
};

export const getCurrentSession = () => {
    return currentSession;
};
