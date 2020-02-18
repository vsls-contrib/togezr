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
    const { id, branchName } = registryData;

    await unregisterBranch(id);
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

    const connections = Object.entries(branchConnections).filter(
        ([key, value]) => {
            return !!value.branchName && !!value.repoId;
        }
    );

    if (!connections.length) {
        vscode.window.showInformationMessage('No connected branches found.');
        return;
    }

    const options = connections.map(([name, connection]) => {
        const { branchName, repoRootPath } = connection;

        return {
            label: branchName!,
            description: path.basename(repoRootPath),
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
