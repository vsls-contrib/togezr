import * as vscode from 'vscode';
import {
    connectorRepository,
    IGitHubConnector,
} from '../../connectorRepository/connectorRepository';
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
        const connector = connectorRepository.getConnector(
            id
        ) as IGitHubConnector;

        if (!connector) {
            throw new Error('No connector found.');
        }

        const token = await keytar.get(connector.accessTokenKeytarKey);
        if (!token) {
            throw new Error('No connector token found.');
        }

        const { repo } = connector;
        const owner = getRepoOwner(repo.html_url);
        const repoName = getRepoName(repo.html_url);
        const issuesEndpoint = `https://api.github.com/repos/${owner}/${repoName}/issues`;
        const issues = await sendGithubRequest<IGitHubIssue[]>(
            token,
            issuesEndpoint,
            'GET'
        );

        if (
            (issues as any).message === 'Not Found' ||
            (issues as any).message === 'Bad credentials'
        ) {
            throw new Error(
                'Github request failed. Did you revoke the access token?'
            );
        }

        interface IIssueOption extends vscode.QuickPickItem {
            id: string;
            issue: IGitHubIssue | null;
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
                    issue: issue,
                } as IIssueOption;
            });
        const CREATE_NEW_ISSUE_ITEM_ID =
            'GitHubConnectorCreateNewIssueQuickPickId';

        issuesOptions.unshift({
            label: '+ Create new',
            description: 'A new GitHub issue will be created.',
            id: CREATE_NEW_ISSUE_ITEM_ID,
            issue: null,
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

            const OPEN_ON_GITHUB_BUTTON = 'Open on GitHub';
            vscode.window
                .showInformationMessage(
                    `Issue#${issue.number} was created: ${issue.html_url}`,
                    OPEN_ON_GITHUB_BUTTON
                )
                .then((result) => {
                    if (result === OPEN_ON_GITHUB_BUTTON) {
                        vscode.env.openExternal(
                            vscode.Uri.parse(issue.html_url)
                        );
                    }
                });

            return {
                githubIssue: issue,
            };
        }

        return {
            githubIssue: selectedIssue.issue,
        };
    };
}
