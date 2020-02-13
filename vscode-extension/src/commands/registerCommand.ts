import * as vscode from 'vscode';
import { createCommand } from './createCommand';
import { IRegisterBranchOptions } from './registerBranch';

export const CommandId = {
    addReporter: 'togezr.addReporter',
    setGitHubToken: 'togezr.setGitHubToken',
    connectBranch: 'togezr.connectBranch',
} as const;

export async function registerCommand(
    name: typeof CommandId.addReporter,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.setGitHubToken,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.connectBranch,
    command: (options?: IRegisterBranchOptions) => Promise<unknown>
): Promise<void>;
export async function registerCommand(name: any, command: any) {
    const wrappedCommand = createCommand(command);

    // push to context
    vscode.commands.registerCommand(name, wrappedCommand);
}
