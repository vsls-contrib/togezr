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
import { initializeKeytar } from './keytar';
import { log } from './logger';
import { initializeMemento } from './memento';

// const checkGitHubAuthToken = async () => {
//     const token = await keytar.get('githubSecret');

//     if (!token) {
//         await vscode.window.showInformationMessage(
//             'No GitHub API token set, please set it to proceed.'
//         );

//         await vscode.commands.executeCommand(CommandId.setGitHubToken);
//     }
// };

export const activate = async (context: vscode.ExtensionContext) => {
    try {
        log.setLoggingChannel(
            vscode.window.createOutputChannel(EXTENSION_NAME)
        );

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

        // const connectors = connectorRepository.getConnectors();
        // const githubConnector = connectors.find((c) => {
        //     return c.type === 'GitHub';
        // }) as IGitHubConnector;

        // if (!githubConnector) {
        //     return;
        // }

        // const isueHandler = new GithubCrossRepoIssueHandler(
        //     githubConnector,
        //     {} as IGitHubIssue
        // );

        // await isueHandler.getRepoIssue();
    } catch (e) {
        log.error(e);
        vscode.window.showErrorMessage(e.message);
    }
};

export const deactivate = async () => {};
