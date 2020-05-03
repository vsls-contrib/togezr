import * as vscode from 'vscode';
import { registerActivityBar } from './activityBar/activityBar';
import { registerBranchBroadcastingExperiment } from './branchBroadcast';
import { startListenToOriginPush } from './branchBroadcast/git/onCommit';
import { initializeLiveShare } from './branchBroadcast/liveshare';
import { registerCommands } from './commands';
import {
    removeAllRunningRegistryRecords,
    removeAllTemporaryRegistryRecords,
} from './commands/registerBranch/branchRegistry';
import { EXTENSION_NAME, setExtensionPath } from './constants';
import { GithubPRIntegration } from './interfaces/integrations/githubPullRequest/githubPullRequestIntegration';
import { initializeKeytar } from './keytar';
import { log } from './logger';
import { initializeMemento } from './memento';

export const activate = async (context: vscode.ExtensionContext) => {
    try {
        log.setLoggingChannel(
            vscode.window.createOutputChannel(EXTENSION_NAME)
        );

        const githubPRIntegration = new GithubPRIntegration();
        githubPRIntegration.init();

        setExtensionPath(context.extensionPath);

        initializeKeytar();
        initializeMemento(context);

        // await gistSessionScheduler.init();

        removeAllTemporaryRegistryRecords();
        removeAllRunningRegistryRecords();

        registerCommands();

        // await checkGitHubAuthToken();

        await initializeLiveShare();
        await registerBranchBroadcastingExperiment();

        startListenToOriginPush();

        registerActivityBar();
        // registerLiveShareTeamsActivityBar();

        // const cachedToken = await auth.getCachedTeamsToken();
        // if (!cachedToken) {
        //     const token = await auth.loginToTeams();

        //     console.log(`** token: `, token);
        // }

        // const connectors = connectorRepository.getConnectors();
        // const githubConnector = connectors.find((c) => {
        //     return c.type === 'GitHub';
        // }) as IGitHubConnector;

        // if (!githubConnector) {
        //     return;
        // }

        // const issueHandler = new GithubCrossRepoIssueHandler(
        //     githubConnector,
        //     {} as IGitHubIssue
        // );

        // await issueHandler.getRepoIssue();
    } catch (e) {
        log.error(e);
        vscode.window.showErrorMessage(e.message);
    }
};

export const deactivate = async () => {};
