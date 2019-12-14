import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { initializeBranchRegistry } from './commands/registerBranch/branchRegistry';
import { EXTENSION_NAME } from './constants';
import { initGit, initializeGitListeners } from './git';
import { initLiveShare } from './liveshare';
import { log } from './logger';

export async function activate(context: vscode.ExtensionContext) {
  try {
    log.setLoggingChannel(vscode.window.createOutputChannel(EXTENSION_NAME));

    initializeBranchRegistry(context);
    initGit();
    await initLiveShare();

    registerCommands();

    await initializeGitListeners();
  } catch (e) {
    log.error(e);
    vscode.window.showErrorMessage(e.message);
  }
}
