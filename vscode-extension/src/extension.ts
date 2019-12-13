import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { initializeBranchRegistry } from './commands/registerBranch/branchRegistry';
import { EXTENSION_NAME } from './constants';
import { initGit } from './git';
import { log } from './logger';

export async function activate(context: vscode.ExtensionContext) {
  try {
    log.setLoggingChannel(vscode.window.createOutputChannel(EXTENSION_NAME));

    initializeBranchRegistry(context);
    initGit();

    registerCommands();
  } catch (e) {
    log.error(e);
    vscode.window.showErrorMessage(e);
  }
}
