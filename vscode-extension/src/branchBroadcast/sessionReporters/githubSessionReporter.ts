import fetch from 'node-fetch';
import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
import { ISessionReporter } from '../interfaces/ISessionReporter';

const GITHUB_BEARER_TOKEN = 'c2c7dea327f0643957242795816502b58382f7dc';

// https://github.com/legomushroom/togezr/issues/1
const getIssueOwner = (url: string) => {
    const split = url.split('/');

    return split[3];
};

const getIssueRepo = (url: string) => {
    const split = url.split('/');

    return split[4];
};

const getIssueId = (url: string) => {
    const split = url.split('/');

    return split[5];
};

export class GithubSessionReporter implements ISessionReporter {
    private guests: IGuest[] = [];

    constructor(private registryData: IRegistryData) {}

    private render() {
        return `[Oleg Solomka](https://github.com/legomushroom) started a [Live Share session](https://github.com/legomushroom).`;
    }

    public async reportSessionStart() {
        // vscode://vs-msliveshare.vsliveshare/join?${this.registryData.sessionId}
        const ghBody = {
            body: this.render(),
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
                    Authorization: `token ${GITHUB_BEARER_TOKEN}`,
                },
                body: JSON.stringify(ghBody, null, 2),
            }
        );

        console.log(ghResult);
    }

    public async reportSessionGuest(guest: IGuest) {
        this.guests.push(guest);
    }
}
