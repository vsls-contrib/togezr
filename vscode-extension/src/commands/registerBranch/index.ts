import * as vscode from 'vscode';
import {
    createBranch,
    getCurrentBranch,
    getCurrentRepoId,
    isBranchExist,
} from '../../branchBroadcast/git';
import { CommandId } from '../registerCommand';
import { getBranchRegistryRecord, unregisterBranch } from './branchRegistry';
import { getBranchName } from './getBranchName';
import { startRegisteringTheBranch } from './registerTheBranchAndAskToSwitch';

class CancellationError extends Error {}

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

    const existingBranchBroadcast = getBranchRegistryRecord(
        getCurrentRepoId(),
        featureBranch
    );
    if (existingBranchBroadcast) {
        const yesButton = 'Register again';
        const answer = await vscode.window.showInformationMessage(
            `The branch "${featureBranch}" is already registered for broadcast. Do you want to update the registration?`,
            yesButton
        );
        if (answer !== yesButton) {
            return;
        }

        await unregisterBranch(getCurrentRepoId(), featureBranch);
    }

    /**
     * If branch is `master` we need to conferm the user intention.
     */
    if (featureBranch === 'master') {
        const yesButton = 'Broadcast "master" branch';
        const answer = await vscode.window.showInformationMessage(
            'Are you sure you want to broadcast "master" branch?',
            yesButton
        );

        if (!answer) {
            return await vscode.commands.executeCommand(
                CommandId.registerBranchForBroadcast
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
    await createBranch(
        featureBranch,
        isShouldSwitchBranch,
        currentBranchName,
        fromBranch
    );

    return await startRegisteringTheBranch(getCurrentRepoId(), featureBranch);
};
