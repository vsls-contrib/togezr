import * as vscode from 'vscode';
import { getBranchRegistryRecordByRepoAndBranch } from '../../commands/registerBranch/branchRegistry';
import { PREVENT_BRANCH_SWITCH_NOTIFICATION_MEMENTO_KEY } from '../../constants';
import * as memento from '../../memento';
import { API, GitExtension, Repository } from '../../typings/git';
import { startLiveShareSession, stopLiveShareSession } from '../liveshare';
import { onBranchChange } from './onBranchChange';

export const getUserName = require('git-user-name') as () => string | undefined;

let gitAPI: API | null = null;

export const initGit = () => {
    let gitExtension = vscode.extensions.getExtension<GitExtension>(
        'vscode.git'
    );

    if (!gitExtension) {
        throw Error('No Git extension found.');
    }

    gitAPI = gitExtension.exports.getAPI(1) as API;
};

export const getRepoOrigin = (repo: Repository): string => {
    const origin = repo.state.remotes.find((remote) => {
        return remote.name === 'origin';
    });

    return origin!.pushUrl!;
};

export const getRepos = () => {
    if (!gitAPI) {
        throw new Error('Initialize Git API first.');
    }

    return gitAPI.repositories;
};

export const getCurrentRepo = (): Repository | undefined => {
    if (!gitAPI) {
        throw new Error('Initialize Git API first.');
    }

    const repo = gitAPI.repositories[0];

    return repo;
};

export const getCurrentBranch = () => {
    if (!gitAPI) {
        throw new Error('Initialize Git API first.');
    }

    const repo = gitAPI.repositories[0];

    if (!repo || !repo.state) {
        throw new Error('Please open a repo');
    }

    return repo.state.HEAD;
};

export const createBranch = async (
    branchName: string,
    isSwitch: boolean,
    fromBranch: string
) => {
    if (!gitAPI) {
        throw new Error('Initialize Git API first.');
    }

    const repo = gitAPI.repositories[0];
    const currentBranch = getCurrentBranch();

    if (isSwitch) {
        await repo.checkout(fromBranch);
    }

    await repo.createBranch(branchName, false);

    if (currentBranch && currentBranch.name) {
        // got back to the original branch
        await repo.checkout(currentBranch.name);
    }
};

export const switchToTheBranch = async (
    branchName: string,
    isPreventMessage = false
) => {
    if (!gitAPI) {
        throw new Error('Initialize Git API first.');
    }

    const repo = gitAPI.repositories[0];

    memento.set(PREVENT_BRANCH_SWITCH_NOTIFICATION_MEMENTO_KEY, branchName);
    try {
        await repo.checkout(branchName);
    } catch (e) {
        memento.remove(PREVENT_BRANCH_SWITCH_NOTIFICATION_MEMENTO_KEY);
    }
};

export const startListenOnBranchChange = async () => {
    if (!gitAPI) {
        throw new Error('Initialize Git API first.');
    }

    onBranchChange(async ([prevBranch, currentBranch]) => {
        if (prevBranch) {
            await stopLiveShareSession();
        }

        if (!currentBranch) {
            return;
        }

        const registryData = getBranchRegistryRecordByRepoAndBranch(
            getCurrentRepoId(),
            currentBranch
        );

        if (!registryData) {
            return;
        }

        if (!registryData.isExplicitellyStopped) {
            return await startLiveShareSession(currentBranch);
        }

        const branchWithoutNotification = memento.get(
            PREVENT_BRANCH_SWITCH_NOTIFICATION_MEMENTO_KEY
        );

        const isPreventBranchSwitchNotification =
            branchWithoutNotification === currentBranch;

        if (isPreventBranchSwitchNotification) {
            memento.remove(PREVENT_BRANCH_SWITCH_NOTIFICATION_MEMENTO_KEY);
        }

        if (
            registryData.isExplicitellyStopped &&
            !isPreventBranchSwitchNotification
        ) {
            const resumeButton = 'Start session';
            const answer = await vscode.window.showInformationMessage(
                `This branch is connected to ${registryData.connectorsData.length} channels, do you want to start session?`,
                resumeButton
            );

            if (!answer) {
                return;
            }

            if (answer === resumeButton) {
                return await startLiveShareSession(currentBranch);
            }
        }
    });
};

export const getCurrentRepoId = () => {
    if (!gitAPI) {
        throw new Error('Initialize Git API first.');
    }

    const repo = gitAPI.repositories[0];

    if (!repo.state) {
        throw new Error('Please open a repo');
    }

    return repo.rootUri.toString();
};

export const isBranchExist = async (branchName: string) => {
    if (!gitAPI) {
        throw new Error('Initialize Git API first.');
    }

    try {
        const repo = gitAPI.repositories[0];

        const branch = await repo.getBranch(branchName);

        return !!branch;
    } catch {
        return false;
    }
};
