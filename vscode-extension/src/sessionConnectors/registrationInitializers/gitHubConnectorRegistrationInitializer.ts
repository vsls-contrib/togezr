import * as vscode from 'vscode';
import { connectorRepository } from '../../connectorRepository/connectorRepository';
import { EXTENSION_NAME_LOWERCASE } from '../../constants';
import { IConnectorRegistrationIitializer } from '../../interfaces/IConnectorRegitrationInitializer';
import { IGitHubIssue } from '../../interfaces/IGitHubIssue';
import * as keytar from '../../keytar';
import { clampString } from '../../utils/clampString';
import { getRepoName } from '../../utils/getRepoName';
import { getRepoOwner } from '../../utils/getRepoOwner';
import { sendGithubRequest } from '../../utils/sendGithubRequest';

export class GitHubConnectorRegistrationInitializer
    implements IConnectorRegistrationIitializer {
    public getData = async (id: string) => {
        const connector = connectorRepository.getConnector(id);
        if (!connector) {
            throw new Error('No connector found.');
        }
        const token = await keytar.get(connector.accessTokenKeytarKey);
        if (!token) {
            throw new Error('No connector token found.');
        }
        const { githubRepoUrl } = connector;
        const owner = getRepoOwner(githubRepoUrl);
        const repoName = getRepoName(githubRepoUrl);
        const issuesEndpoint = `https://api.github.com/repos/${owner}/${repoName}/issues`;
        const issues = await sendGithubRequest<IGitHubIssue[]>(
            token,
            issuesEndpoint,
            'GET'
        );
        if ((issues as any).message === 'Not Found') {
            throw new Error('Request failed.');
        }
        const issuesOptions = issues
            .filter((issue) => {
                return issue.state !== 'closed' && issue.locked === false;
            })
            .map((issue) => {
                return {
                    label: `⎇ ${issue.title}`,
                    description: `#${issue.number}`,
                    detail: clampString(issue.body, 140),
                    id: issue.id,
                    url: issue.html_url,
                };
            });
        const CREATE_NEW_ISSUE_ITEM_ID =
            'GitHubConnectorCreateNewIssueQuickPickId';
        issuesOptions.unshift({
            label: '+ Create new',
            description: 'A new GitHub issue will be created.',
            id: CREATE_NEW_ISSUE_ITEM_ID,
            url: '',
            detail: '',
        });
        const selectedIssue = await vscode.window.showQuickPick(issuesOptions, {
            ignoreFocusOut: true,
            placeHolder: 'Select an issue to report to',
        });
        if (!selectedIssue) {
            throw new Error('You must select an issue to proceed.');
        }
        if (selectedIssue.id === CREATE_NEW_ISSUE_ITEM_ID) {
            const issue: IGitHubIssue = await sendGithubRequest(
                token,
                issuesEndpoint,
                'POST',
                {
                    title: `[Togezr][wip] Details coming soon.`,
                    labels: [EXTENSION_NAME_LOWERCASE],
                    body: '*Details coming soon..*',
                }
            );
            selectedIssue.url = issue.html_url;
            vscode.window.showInformationMessage(
                `Issue#${issue.number} was created: ${selectedIssue.url}.`
            );
        }
        return {
            githubIssue: selectedIssue.url,
        };
    };
}
