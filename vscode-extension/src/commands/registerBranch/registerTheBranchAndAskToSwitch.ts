import * as vscode from 'vscode';
import { getCurrentBranch, switchToTheBranch } from '../../branchBroadcast/git';
import { startLiveShareSession } from '../../branchBroadcast/liveshare';
import { IReportersData } from '../../interfaces/IReportersData';
import { reporterRepository } from '../../reporterRepository/reporterRepository';
import { getReporterRegistrationInitializer } from '../addReporterCommand';
import { registerBranch } from './branchRegistry';

export const registerTheBranchAndAskToSwitch = async (
    repoId: string,
    branchName: string,
    reportersData: IReportersData
) => {
    await registerBranch({
        repoId,
        branchName,
        reportersData,
    });

    const currentBranch = getCurrentBranch();
    const buttonPrefix =
        !currentBranch || currentBranch.name !== branchName ? 'Switch & ' : '';
    const startButton = `${buttonPrefix}Start Broadcasting`;
    const answer = await vscode.window.showInformationMessage(
        `The "${branchName}" was successfully registered for broadcast.`,
        startButton
    );
    if (answer === startButton) {
        await switchToTheBranch(branchName);
        await startLiveShareSession(branchName);
    }
};

export const startRegisteringTheBranch = async (
    repoId: string,
    branchName: string
) => {
    const registeredReporters = reporterRepository.getReporters();
    if (!registeredReporters.length) {
        throw new Error(
            'No reporters found, register one first by running `Togezr: Add reporter` command in command palette.'
        );
    }

    const reportersOptions = registeredReporters.map((r) => {
        return {
            label: `${r.type}: ${r.name}`,
            id: r.id,
            type: r.type,
        };
    });

    const reporters = await vscode.window.showQuickPick(reportersOptions, {
        canPickMany: true,
        ignoreFocusOut: true,
    });

    if (!reporters) {
        throw new Error('Please select at least one reporter.');
    }

    const reportersData: IReportersData = [];

    for (let { id, type } of reporters) {
        const init = getReporterRegistrationInitializer(type);

        if (!init) {
            reportersData.push({ id, type });
            continue;
        }

        const data = await init.getData(id);

        reportersData.push({ id, data, type });
    }

    await registerTheBranchAndAskToSwitch(repoId, branchName, reportersData);
};
