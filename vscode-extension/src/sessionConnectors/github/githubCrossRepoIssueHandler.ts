import { IGitHubConnector } from '../../connectorRepository/connectorRepository';
import { IGitHubIssue } from '../../interfaces/IGitHubIssue';
import * as keytar from '../../keytar';
import { sendGithubRequest } from '../../utils/sendGithubRequest';
import { ISSUE_SESSION_DETAILS_HEADER } from '../constants';

export class GithubCrossRepoIssueHandler {
    constructor(
        private connector: IGitHubConnector,
        private issue: IGitHubIssue
    ) {}

    public getRepoIssue = async (): Promise<IGitHubIssue | undefined> => {
        const { name, owner } = this.connector.repo;

        const token = await keytar.get(this.connector.accessTokenKeytarKey);

        if (!token) {
            throw new Error('No token found for the connector.');
        }

        const repoUrl = `https://api.github.com/repos/${owner.login}/${name}/issues`;
        const result = await sendGithubRequest<IGitHubIssue[]>(
            token,
            repoUrl,
            'GET'
        );

        const repoIssue = result.find((issue) => {
            return issue.title === '[Togezr]: Upcoming Live Share sessions';
        });

        return repoIssue;
    };

    private isIssueContents(issueContents: string) {
        const { name, owner } = this.connector.repo;

        const index = issueContents.indexOf(
            `[[#${this.issue.number}](https://github.com/${owner.login}/${name}/issues/${this.issue.number})]`
        );

        return index !== -1;
    }

    private getIssueRecordIndex(issues: string[]) {
        for (let i = 0; i < issues.length; i++) {
            const issueString = issues[i];
            const isIssue = this.isIssueContents(issueString);

            if (isIssue) {
                return i;
            }
        }

        return -1;
    }

    public parseIssues(contents: '') {
        const parsedIssues = contents.split(ISSUE_SESSION_DETAILS_HEADER);

        if (parsedIssues.length >= 3) {
            // remove header and footer
            parsedIssues.shift();
            parsedIssues.length = parsedIssues.length - 1;
        }

        return [parsedIssues, this.getIssueRecordIndex(parsedIssues)];
    }
}
