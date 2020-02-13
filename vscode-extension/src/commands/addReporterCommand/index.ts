import fetch from 'node-fetch';
import * as vscode from 'vscode';
import { CancellationError } from '../../errors/CancellationError';
import {
    KNOWN_REPORTER_TYPES,
    reporterRepository,
    TKnowReporters,
} from '../../reporterRepository/reporterRepository';
import { getRepoName } from '../../utils/getRepoName';
import { getRepoOwner } from '../../utils/getRepoOwner';

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
                    const result = await fetch(
                        `https://api.github.com/repos/${owner}/${repoName}/issues`,
                        {
                            headers: {
                                Authorization: `token ${token}`,
                            },
                        }
                    );

                    const resultJson = await result.json();
                    if (resultJson.message === 'Not Found') {
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

        reporterRepository.addGitHubReporter(name, githubRepoUrl, token);

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
