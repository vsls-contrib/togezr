import * as vsls from 'vsls';
import { getBranchRegistryRecord } from '../../commands/registerBranch/branchRegistry';
import { EXTENSION_NAME_LOWERCASE } from '../../constants';
import * as keytar from '../../keytar';
import { Repository } from '../../typings/git';
import { ISessionReporter } from '../interfaces/ISessionReporter';
import { getIssueId } from './getIssueId';
import { getIssueOwner } from './getIssueOwner';
import { getIssueRepo } from './getIssueRepo';
import { getIssueTextWithDetailsGithub } from './getIssueTextWithDetailsGithub';
import { githubAvatarRepository } from './githubAvatarsRepository';
import { renderGuestsGithub } from './renderGuestsGithub';
import { sendGithubRequest } from './sendGithubRequest';
const time = require('pretty-ms');

export const getAuthToken = async () => {
    const token = await keytar.get('githubSecret');

    if (!token) {
        throw new Error('No GitHHub auth token set.');
    }

    return token;
};

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

// interface IUserInfoWithTiming {
//     user: vsls.UserInfo;
//     joinTimestamp: number;
// }

interface ISessionEventBase {
    type: 'start-session' | 'guest-join' | 'commit-push';
    timestamp: number;
}

interface ISessionStartEvent extends ISessionEventBase {
    type: 'start-session';
}

interface ISessionUserJoinEvent extends ISessionEventBase {
    type: 'guest-join';
    user: vsls.UserInfo;
}

interface ISessionCommitPushEvent extends ISessionEventBase {
    type: 'commit-push';
    commitId: string;
}

type ISessionEvent =
    | ISessionUserJoinEvent
    | ISessionCommitPushEvent
    | ISessionStartEvent;

export class GithubSessionReporter implements ISessionReporter {
    private sessionCommentUrl: string | undefined;

    // private guests: IUserInfoWithTiming[] = [];

    private events: ISessionEvent[] = [];

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
        private repo: Repository
    ) {
        this.sessionStartTimestamp = Date.now();

        this.vslsAPI.onDidChangePeers(async (e: vsls.PeersChangeEvent) => {
            if (e.removed.length) {
                return;
            }

            const userAdded = e.added[0];
            const { user } = userAdded;

            if (!user || !user.id) {
                throw new Error('User not found or joined without id.');
            }

            setTimeout(async () => {
                await this.renderSessionDetails();
                await this.reportGuestJoined(user);
            }, 10);
        });
    }

    public async init() {
        await Promise.all([
            this.renderSessionDetails(),
            this.reportSessionStartMessage(),
        ]);

        return this;
    }

    public async dispose() {}

    private renderSessionDetails = async () => {
        const { githubIssue } = this.registryData;

        const url = `https://api.github.com/repos/${getIssueOwner(
            githubIssue
        )}/${getIssueRepo(githubIssue)}/issues/${getIssueId(githubIssue)}`;

        const issue = await sendGithubRequest(url, 'GET');

        const { body = '' } = issue;
        const labels: IGitHubIssueLabel[] = issue.labels;

        const togezrLabel = labels.find((label) => {
            return label.name === EXTENSION_NAME_LOWERCASE;
        });

        if (!togezrLabel) {
            labels.push(EXTENSION_NAME_LOWERCASE as any);
        }

        const issueDetailsUpdateUrl = `https://api.github.com/repos/${getIssueOwner(
            githubIssue
        )}/${getIssueRepo(githubIssue)}/issues/${getIssueId(githubIssue)}`;

        await sendGithubRequest(issueDetailsUpdateUrl, 'PATCH', {
            body: await getIssueTextWithDetailsGithub(
                body,
                this.registryData,
                this.repo
            ),
            labels,
        });
    };

    private reportSessionStartMessage = async () => {
        const { githubIssue, sessionId } = this.registryData;

        const host = this.vslsAPI.session.user;

        if (!host) {
            throw new Error('No host found.');
        }

        const { userName } = host;

        const guests = this.events.filter((e) => {
            return e.type === 'guest-join';
        }) as ISessionUserJoinEvent[];

        const gs = guests.map((g) => {
            return {
                data: g.user,
                sessionCount: -1,
            };
        });

        const joinedGuests = guests.map((g) => {
            const timeDelta = g.timestamp - this.sessionStartTimestamp;
            const prettyTimeDelta = time(timeDelta);

            return `- 🤝 @${g.user.userName} joined the session. *(+${prettyTimeDelta})*`;
        });

        const joinedGuestsString = joinedGuests.length
            ? `\n ${joinedGuests.join('\n')}`
            : '';

        // vscode://vs-msliveshare.vsliveshare/join?${sessionId}
        const ghBody = {
            body: `${await renderGuestsGithub([
                {
                    data: host,
                    sessionCount: -1,
                },
                ...gs,
            ])}\n![togezr separator](https://aka.ms/togezr-issue-separator-image)\n🧑‍💻 @${userName} started [Live Share session](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId}).${joinedGuestsString}`,
        };

        if (!this.sessionCommentUrl) {
            const url = `https://api.github.com/repos/${getIssueOwner(
                githubIssue
            )}/${getIssueRepo(githubIssue)}/issues/${getIssueId(
                githubIssue
            )}/comments`;

            const res = await sendGithubRequest(url, 'POST', ghBody);

            this.sessionCommentUrl = res.url;

            if (!this.sessionCommentUrl) {
                throw new Error('No session comment created.');
            }
        } else {
            await sendGithubRequest(this.sessionCommentUrl, 'PATCH', ghBody);
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

        // this.guests.push({
        //     user: guest,
        //     joinTimestamp: Date.now(),
        // });

        await this.reportSessionStartMessage();
    };
}
