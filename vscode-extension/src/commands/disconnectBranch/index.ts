import * as path from 'path';
import * as vscode from 'vscode';
import {
    BranchConnectionTreeItem,
    refreshActivityBar,
} from '../../activityBar/activityBar';
import {
    getRegistryRecords,
    IRegistryData,
    unregisterBranch,
} from '../registerBranch/branchRegistry';

const removeBranchConnection = async (registryData: IRegistryData) => {
    const { repoId, branchName } = registryData;

    await unregisterBranch(repoId, branchName);
    refreshActivityBar();

    await vscode.window.showInformationMessage(
        `Branch "${branchName}" successfully disconnected.`
    );
};

export const disconnectBranchCommand = async (
    item?: BranchConnectionTreeItem
) => {
    if (item) {
        await removeBranchConnection(item.registryData);
        return;
    }

    const branchConnections = getRegistryRecords();

    const connections = Object.entries(branchConnections);
    if (!connections.length) {
        vscode.window.showInformationMessage('No connected branches found.');
        return;
    }

    const options = connections.map(([name, connection]) => {
        const { branchName, repoId } = connection;
        return {
            label: branchName,
            description: path.basename(repoId),
            data: connection,
        };
    });

    const answer = await vscode.window.showQuickPick(options, {
        ignoreFocusOut: true,
    });

    if (!answer) {
        return;
    }

    await removeBranchConnection(answer.data);
};
