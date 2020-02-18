import * as vscode from 'vscode';
import { getCurrentBranch, getCurrentRepo } from '../../branchBroadcast/git';
import { startLiveShareSession } from '../../branchBroadcast/liveshare';
import { connectorRepository } from '../../connectorRepository/connectorRepository';
import { CancellationError } from '../../errors/CancellationError';
import { IConnectorData } from '../../interfaces/IConnectorData';
import { getConnectorRegistrationInitializer } from '../../sessionConnectors/registrationInitializers';
import { Branch, Repository } from '../../typings/git';
import { registerBranch } from '../registerBranch/branchRegistry';

export const shareIntoCommand = async () => {
    if (!vscode.workspace.rootPath) {
        throw new Error('Please open a project to share.');
    }

    const READ_ONLY_BUTTON = 'Read-only session';
    const answer = await vscode.window.showQuickPick(
        ['Read/Write session', READ_ONLY_BUTTON],
        {
            placeHolder: 'Select session type by default',
            ignoreFocusOut: true,
        }
    );

    if (!answer) {
        throw new CancellationError('No default session type selected.');
    }

    const isReadOnlySession = answer === READ_ONLY_BUTTON;

    const connectors = connectorRepository.getConnectors();

    const connectorOptions = connectors.map((connector) => {
        return {
            label: connector.name,
            description: connector.type,
            connector,
        };
    });

    const selectedConnectors = await vscode.window.showQuickPick(
        connectorOptions,
        {
            placeHolder: 'Select conenctors to share into',
            canPickMany: true,
        }
    );

    if (!selectedConnectors) {
        throw new CancellationError('No connectors selected.');
    }

    const connectorsData: IConnectorData[] = [];
    for (let { connector } of selectedConnectors) {
        const init = getConnectorRegistrationInitializer(connector.type);

        if (!init) {
            connectorsData.push(connector);
            continue;
        }

        const data = await init.getData(connector.id, true);

        connectorsData.push({ ...connector, data });
    }

    let repo: Repository | undefined;
    let branch: Branch | undefined;
    try {
        repo = getCurrentRepo();
        branch = getCurrentBranch();
    } catch {}

    const registryData = await registerBranch({
        repoId: repo && repo.rootUri.toString(),
        branchName: branch && branch.name,
        connectorsData,
        isReadOnly: isReadOnlySession,
        isTemporary: true,
        repoRootPath: vscode.workspace.rootPath.toString(),
    });

    await startLiveShareSession(registryData.id);
};
