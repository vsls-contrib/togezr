import * as vscode from 'vscode';
import {
    getCurrentBranch,
    getCurrentRepoId,
    isBranchExist,
} from '../../branchBroadcast/git';
import { CancellationError } from '../../errors/CancellationError';
import { CommandId } from '../registerCommand';
import { getBranchRegistryRecordByRepoAndBranch } from './branchRegistry';
import { getBranchName } from './getBranchName';
import { startRegisteringTheBranch } from './registerTheBranchAndAskToSwitch';

export interface IRegisterBranchOptions {}

export const registerBranchCommand = async (
    options: IRegisterBranchOptions = {}
) => {
    const currentBranch = getCurrentBranch();

    if (!currentBranch) {
        throw new Error('Please open a repo to start with.');
    }

    const [value, selection] = getBranchName(currentBranch);
    const inputMessage = 'Select Branch for Broadcast';
    const branch = await vscode.window.showInputBox({
        prompt: inputMessage,
        value,
        valueSelection: selection,
        ignoreFocusOut: true,
    });

    if (!branch) {
        throw new CancellationError('No branch selected.');
    }

    const featureBranch = branch.trim().toLowerCase();

    const existingBranchBroadcast = getBranchRegistryRecordByRepoAndBranch(
        getCurrentRepoId(),
        featureBranch
    );

    if (existingBranchBroadcast) {
        const yesButton = 'Connect again';
        const answer = await vscode.window.showInformationMessage(
            `The branch "${featureBranch}" is already connected to ${existingBranchBroadcast.connectorsData.length} channels. Do you want to connect it again?`,
            yesButton
        );

        if (answer !== yesButton) {
            return;
        }
    }

    /**
     * If branch is `master` we need to conferm the user intention.
     */
    if (featureBranch === 'master') {
        const yesButton = 'Connect the "master" branch';
        const answer = await vscode.window.showInformationMessage(
            'Are you sure you want to connect "master" branch?',
            yesButton
        );

        if (!answer) {
            return await vscode.commands.executeCommand(
                CommandId.connectBranch
            );
        }
    }

    /**
     * If feature branch is present we don't have to create it.
     */
    const isBranchPresent = await isBranchExist(featureBranch);
    if (isBranchPresent) {
        return await startRegisteringTheBranch(
            getCurrentRepoId(),
            featureBranch
        );
    }

    /**
     * If feature branch not the current one and current one is not master, we need to confirm user intention.
     */
    const currentBranchName = currentBranch.name!.toLowerCase();
    let fromBranch = 'master';
    if (featureBranch !== currentBranchName && currentBranchName !== 'master') {
        const message = `Are you sure you want to start the feature branch not from master branch?`;
        const masterOption = 'Start from "master"';
        const featureBranchOption = `Start from "${currentBranchName}"`;
        const pickerOptions = [masterOption, featureBranchOption];
        const answer = await vscode.window.showQuickPick(pickerOptions, {
            placeHolder: message,
        });

        if (!answer) {
            throw new CancellationError(
                'The feature branch registration was cancelled.'
            );
        }

        fromBranch = answer === masterOption ? 'master' : featureBranch;
    }

    const isShouldSwitchBranch = currentBranchName !== fromBranch;

    return await startRegisteringTheBranch(
        getCurrentRepoId(),
        featureBranch,
        fromBranch,
        isShouldSwitchBranch
    );
};
