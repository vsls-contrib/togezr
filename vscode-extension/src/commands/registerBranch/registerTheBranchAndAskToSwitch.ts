import * as vscode from 'vscode';
import {
    createBranch,
    getCurrentBranch,
    getCurrentRepo,
    switchToTheBranch,
} from '../../branchBroadcast/git';
import { startLiveShareSession } from '../../branchBroadcast/liveshare';
import { connectorRepository } from '../../connectorRepository/connectorRepository';
import { IConnectorData } from '../../interfaces/IConnectorData';
import { getConnectorRegistrationInitializer } from '../../sessionConnectors/registrationInitializers';
import { registerBranch } from './branchRegistry';

export const registerTheBranchAndAskToSwitch = async (
    repoId: string,
    branchName: string,
    connectorsData: IConnectorData[],
    isShouldSwitchBranch: boolean,
    fromBranch?: string
) => {
    if (fromBranch) {
        await createBranch(branchName, isShouldSwitchBranch, fromBranch);
    }

    const registryData = await registerBranch({
        repoId,
        branchName,
        connectorsData,
    });

    const repo = getCurrentRepo();

    if (!repo) {
        throw new Error('No repo openned.');
    }

    await repo.push('origin', branchName);

    const currentBranch = getCurrentBranch();
    const buttonPrefix =
        !currentBranch || currentBranch.name !== branchName ? 'Switch & ' : '';
    const startButton = `${buttonPrefix}Start session`;
    const answer = await vscode.window.showInformationMessage(
        `The "${branchName}" was successfully connected with ${registryData.connectorsData.length} channels. Start session now?`,
        startButton
    );
    if (answer === startButton) {
        await switchToTheBranch(branchName);
        await startLiveShareSession(branchName);
    }
};

export const startRegisteringTheBranch = async (
    repoId: string,
    branchName: string,
    fromBranch?: string,
    isShouldSwitchBranch = false
) => {
    const registeredConnectors = connectorRepository.getConnectors();
    if (!registeredConnectors.length) {
        throw new Error(
            'No connectors found, register one first by running `Togezr: Add connector` command in command palette.'
        );
    }

    const connectorsOptions = registeredConnectors.map((r) => {
        return {
            label: `${r.type}: ${r.name}`,
            id: r.id,
            type: r.type,
        };
    });

    const connectors = await vscode.window.showQuickPick(connectorsOptions, {
        canPickMany: true,
        ignoreFocusOut: true,
    });

    if (!connectors) {
        throw new Error('Please select at least one connector.');
    }

    const connectorsData: IConnectorData[] = [];

    for (let { id, type } of connectors) {
        const init = getConnectorRegistrationInitializer(type);

        if (!init) {
            connectorsData.push({ id, type });
            continue;
        }

        const data = await init.getData(id);

        connectorsData.push({ id, data, type });
    }

    await registerTheBranchAndAskToSwitch(
        repoId,
        branchName,
        connectorsData,
        isShouldSwitchBranch,
        fromBranch
    );
};
