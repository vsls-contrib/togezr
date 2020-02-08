import fetch from 'node-fetch';
import {
    getBranchRegistryRecord,
    IGuestWithSessions,
    IRegistryData,
} from '../../commands/registerBranch/branchRegistry';
import { EXTENSION_NAME_LOWERCASE } from '../../constants';
import * as keytar from '../../keytar';
import { Repository } from '../../typings/git';
import { getRepoOrigin } from '../git';
import { ISessionReporter } from '../interfaces/ISessionReporter';
import { randomInt } from '../utils/randomInt';
import {
    DEFAULT_GITHUB_AVATAR,
    ISSUE_SESSION_DETAILS_FOOTER,
    ISSUE_SESSION_DETAILS_HEADER,
} from './constants';
import { getIssueId } from './getIssueId';
import { getIssueOwner } from './getIssueOwner';
import { getIssueRepo } from './getIssueRepo';
import { githubAvatarRepository } from './githubAvatarsRepository';

const getAuthToken = async () => {
    const token = await keytar.get('githubSecret');

    if (!token) {
        throw new Error('No GitHHub auth token set.');
    }

    return token;
};

const getIssueTextWithDetails = async (
    description: string,
    data: IRegistryData,
    repo: Repository
) => {
    const descriptionRegex = /(\!\[togezr\sseparator\]\(https:\/\/aka\.ms\/togezr-issue-separator-image\)[\s\S]+\#\#\#\#\#\# powered by \[Togezr\]\(https\:\/\/aka\.ms\/togezr-issue-website-link\))/gm;

    const isPresent = !!description.match(descriptionRegex);

    const issueDetails = await getIssueSessionDetails(data, repo);

    if (isPresent) {
        return description.replace(descriptionRegex, issueDetails);
    }

    return `${description}\n\n${issueDetails}`;
};

const getIssueSessionDetails = async (
    data: IRegistryData,
    repo: Repository
) => {
    return [
        ISSUE_SESSION_DETAILS_HEADER,
        getIssueDetailsGit(data, repo),
        await renderGuests(data.guests),
        getIssueDetailsLiveShare(data),
        ISSUE_SESSION_DETAILS_FOOTER,
    ].join('\n\n');
};

const getGithubUsername = (guest: IGuest): string | null => {
    return guest.githubUsername || null;
};

const getGithubAvatar = async (username: string) => {
    return await githubAvatarRepository.getAvatarFor(username);
};

const isEmail = (thing: string) => {
    if (!thing) {
        return false;
    }

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(thing).toLowerCase());
};

const renderGuests = async (guests: IGuestWithSessions[]) => {
    const resultPromises = guests.map(async (guest) => {
        const username = getGithubUsername(guest.data);

        if (!username || isEmail(username)) {
            return `<img src="${DEFAULT_GITHUB_AVATAR}" width="40" alt="${guest.data.email}" title="${guest.data.name} (${guest.data.email}) ${guest.sessionCount} sessions" />`;
        }

        const avatarUrl = await getGithubAvatar(username);
        const image = `<img src="${avatarUrl}" width="40" alt="${username}" title="${guest.data.name} (@${username}) ${guest.sessionCount} sessions" />`;

        return `[${image}](https://github.com/${username})`;
    });

    const result = await Promise.all(resultPromises);

    return result.join(' ');
};

const getIssueDetailsGit = (data: IRegistryData, repo: Repository) => {
    const { branchName } = data;

    const repoUrl = getRepoOrigin(repo).replace(/\.git$/i, '');

    const result = `**⎇** [${branchName}](${repoUrl}/tree/${branchName}) [ [⇄ master](${repoUrl}/compare/${branchName}) ]`;
    return result;
};

const getIssueDetailsLiveShare = (data: IRegistryData) => {
    const { sessionId } = data;

    return `[![Live Share](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-badge?sessionId=${sessionId}&v=${randomInt()})](https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId})`;
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
    private guests: IGuest[] = [];

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
        private repoId: string,
        private branchName: string,
        private repo: Repository
    ) {}

    private ensureIssueSessionDetails = async () => {
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
                    body: await getIssueTextWithDetails(
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
        // vscode://vs-msliveshare.vsliveshare/join?${this.registryData.sessionId}
        const ghBody = {
            body: `[Oleg Solomka](https://github.com/legomushroom) started a [Live Share session](https://github.com/legomushroom).`,
        };

        const { githubIssue } = this.registryData;

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

        console.log(ghResult);
    };

    public async reportSessionStart() {
        await Promise.all([
            this.ensureIssueSessionDetails(),
            this.reportSessionStartMessage(),
        ]);
    }

    public async reportSessionGuest(guest: IGuest) {
        this.guests.push(guest);
    }
}
