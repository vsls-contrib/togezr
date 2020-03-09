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
    shareIntoAccount: 'togezr.shareIntoAccount',
    stopRunningSession: 'togezr.stopRunningSession',
    startBranchConnectionSession: 'togezr.startBranchConnectionSession',
    openInBrowser: 'togezr.openInBrowser',
    openConnectorInBrowser: 'togezr.openConnectorInBrowser',
    addAccount: 'togezr.addAccount',
    removeAccount: 'togezr.removeAccount',
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
export async function registerCommand(
    name: typeof CommandId.startBranchConnectionSession,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.openInBrowser,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.openConnectorInBrowser,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.addAccount,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.removeAccount,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(
    name: typeof CommandId.shareIntoAccount,
    command: () => Promise<unknown>
): Promise<void>;
export async function registerCommand(name: any, command: any) {
    const wrappedCommand = createCommand(command);

    // push to context
    vscode.commands.registerCommand(name, wrappedCommand);
}
