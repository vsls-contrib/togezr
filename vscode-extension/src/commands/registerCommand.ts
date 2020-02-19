import * as vscode from 'vscode';
import { createCommand } from './createCommand';
import { IRegisterBranchOptions } from './registerBranch';

export const CommandId = {
    addConnector: 'togezr.addConnector',
    removeConnector: 'togezr.removeConnector',
    setGitHubToken: 'togezr.setGitHubToken',
    connectBranch: 'togezr.connectBranch',
    disconnectBranch: 'togezr.disconnectBranch',
    shareInto: 'togezr.shareInto',
    stopRunningSession: 'togezr.stopRunningSession',
} as const;

export async function registerCommand(
    name: typeof CommandId.addConnector,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.removeConnector,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.connectBranch,
    command: (options?: IRegisterBranchOptions) => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.disconnectBranch,
    command: (branch: any) => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.shareInto,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.stopRunningSession,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(name: any, command: any) {
    const wrappedCommand = createCommand(command);

    // push to context
    vscode.commands.registerCommand(name, wrappedCommand);
}
