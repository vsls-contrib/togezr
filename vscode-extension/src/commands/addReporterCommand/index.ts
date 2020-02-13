import * as vscode from 'vscode';
import { GithubSessionReporter } from '../../branchBroadcast/sessionReporters/githubSessionReporter';
import { EXTENSION_NAME_LOWERCASE } from '../../constants';
import { CancellationError } from '../../errors/CancellationError';
import { IGitHubIssue } from '../../interfaces/IGitHubIssue';
import * as keytar from '../../keytar';
import {
    KNOWN_REPORTER_TYPES,
    reporterRepository,
    TKnowReporters,
} from '../../reporterRepository/reporterRepository';
import { clampString } from '../../utils/clampString';
import { getRepoName } from '../../utils/getRepoName';
import { getRepoOwner } from '../../utils/getRepoOwner';
import { sendGithubRequest } from '../../utils/sendGithubRequest';

interface IReporterCommandInitializer {
    init(): Promise<void>;
}

class GitHubReporterCommandInitializer implements IReporterCommandInitializer {
    public init = async () => {
        const githubRepoUrl = await vscode.window.showInputBox({
            prompt: 'Specify a GitHub repo',
            ignoreFocusOut: true,
        });

        if (!githubRepoUrl) {
            throw new CancellationError('No GitHub repo is specified.');
        }

        const token = await vscode.window.showInputBox({
            prompt: 'Set a GitHub auth token',
            ignoreFocusOut: true,
        });

        if (!token) {
            throw new CancellationError('No GitHub token is specified.');
        }

        const owner = getRepoOwner(githubRepoUrl);
        const repoName = getRepoName(githubRepoUrl);

        await vscode.window.withProgress(
            {
                title: 'Verifying permissions..',
                location: vscode.ProgressLocation.Notification,
            },
            async () => {
                try {
                    const result = await sendGithubRequest(
                        token,
                        `https://api.github.com/repos/${owner}/${repoName}/issues`,
                        'GET'
                    );

                    if ((result as any).message === 'Not Found') {
                        throw new CancellationError("Can't get repo issues.");
                    }
                } catch (e) {
                    if (e instanceof CancellationError) {
                        throw e;
                    }
                }
            }
        );

        const value = `${owner}/${repoName}`;
        const name = await vscode.window.showInputBox({
            prompt: 'What is the name of this reporter?',
            ignoreFocusOut: true,
            value,
            valueSelection: [0, value.length],
        });

        if (!name) {
            throw new CancellationError('No reporter name specified.');
        }

        await reporterRepository.addGitHubReporter(name, githubRepoUrl, token);

        await vscode.window.showInformationMessage(
            `The reporter "${name}" successfully added.`
        );
    };
}

const getReporterCommandInitializer = (reporterType: TKnowReporters) => {
    if (reporterType === 'GitHub') {
        return new GitHubReporterCommandInitializer();
    }

    throw new Error(
        `No reporter command initializer for "${reporterType}" reporter found.`
    );
};

interface IReporterRegistrationIitializer {
    getData(id: string): Promise<any>;
}

class GitHubReporterRegistrationInitializer
    implements IReporterRegistrationIitializer {
    public getData = async (id: string) => {
        const reporter = reporterRepository.getReporter(id);
        if (!reporter) {
            throw new Error('No reporter found.');
        }

        const token = await keytar.get(reporter.accessTokenKeytarKey);
        if (!token) {
            throw new Error('No reporter token found.');
        }

        const { githubRepoUrl } = reporter;

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
            'GitHubReporterCreateNewIssueQuciPickId';

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

export const getReporterRegistrationInitializer = (
    reporterType: TKnowReporters
) => {
    if (reporterType === 'GitHub') {
        return new GitHubReporterRegistrationInitializer();
    }
};

export const getReporter = (reporterType: TKnowReporters) => {
    if (reporterType === 'GitHub') {
        return GithubSessionReporter;
    }
    throw new Error(`No reporter for "${reporterType}" type found.`);
};

export const addReporterCommand = async () => {
    let pickedReporter = KNOWN_REPORTER_TYPES[0];
    if (KNOWN_REPORTER_TYPES.length > 1) {
        pickedReporter = (await vscode.window.showQuickPick(
            KNOWN_REPORTER_TYPES,
            {
                placeHolder: 'Pick a reporter type',
            }
        )) as TKnowReporters;

        if (!pickedReporter) {
            throw new CancellationError();
        }
    }

    const initializer = getReporterCommandInitializer(pickedReporter);

    await initializer.init();
};
