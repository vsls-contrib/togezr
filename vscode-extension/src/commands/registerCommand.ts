import * as vscode from 'vscode';
import { createCommand } from './createCommand';
import { IRegisterBranchOptions } from './registerBranch';

export const CommandId = {
    setGitHubToken: 'togezr.setGitHubToken',
    registerBranchForBroadcast: 'togezr.registerFeatureBranchForBroadcast',
} as const;

export async function registerCommand(
    name: typeof CommandId.setGitHubToken,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.registerBranchForBroadcast,
    command: (options?: IRegisterBranchOptions) => Promise<unknown>
): Promise<void>;
export async function registerCommand(name: any, command: any) {
    const wrappedCommand = createCommand(command);

    // push to context
    vscode.commands.registerCommand(name, wrappedCommand);
}
