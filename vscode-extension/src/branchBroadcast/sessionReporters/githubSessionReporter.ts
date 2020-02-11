import fetch from 'node-fetch';
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
const time = require('pretty-ms');

const getAuthToken = async () => {
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

interface IUserInfoWithTiming {
    user: vsls.UserInfo;
    joinTimestamp: number;
}

export class GithubSessionReporter implements ISessionReporter {
    private sessionCommentUrl: string | undefined;

    private guests: IUserInfoWithTiming[] = [];

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

        const issueResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${await getAuthToken()}`,
            },
        });

        const issue = await issueResponse.json();

        const { body = [] } = issue;
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

        const issueDetailsResponse = await fetch(issueDetailsUpdateUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${await getAuthToken()}`,
            },
            body: JSON.stringify(
                {
                    body: await getIssueTextWithDetailsGithub(
                        body,
                        this.registryData,
                        this.repo
                    ),
                    labels,
                },
                null,
                2
            ),
        });

        const jsonRes = await issueDetailsResponse.json();
        console.log(jsonRes);
    };

    private reportSessionStartMessage = async () => {
        const { githubIssue, sessionId } = this.registryData;

        const host = this.vslsAPI.session.user;

        if (!host) {
            throw new Error('No host found.');
        }

        const { userName } = host;

        const gs = this.guests.map((g) => {
            return {
                data: g.user,
                sessionCount: -1,
            };
        });

        const joinedGuests = this.guests.map((g) => {
            const timeDelta = g.joinTimestamp - this.sessionStartTimestamp;
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
            const ghResult = await fetch(
                `https://api.github.com/repos/${getIssueOwner(
                    githubIssue
                )}/${getIssueRepo(githubIssue)}/issues/${getIssueId(
                    githubIssue
                )}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `token ${await getAuthToken()}`,
                    },
                    body: JSON.stringify(ghBody, null, 2),
                }
            );

            const res = await ghResult.json();

            this.sessionCommentUrl = res.url;

            if (!this.sessionCommentUrl) {
                throw new Error('No session comment created.');
            }
        } else {
            await fetch(this.sessionCommentUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `token ${await getAuthToken()}`,
                },
                body: JSON.stringify(ghBody, null, 2),
            });
        }
    };

    private reportGuestJoined = async (guest: vsls.UserInfo) => {
        const isGuestInSession = this.guests.find((g) => {
            return g.user.id === guest.id;
        });

        if (isGuestInSession) {
            return;
        }

        this.guests.push({
            user: guest,
            joinTimestamp: Date.now(),
        });

        await this.reportSessionStartMessage();
    };
}
