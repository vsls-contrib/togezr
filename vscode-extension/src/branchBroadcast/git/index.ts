import * as vscode from 'vscode';
import {
    getBranchRegistryRecord,
    resetBranchExplicitelyStopped,
    unregisterBranch,
} from '../../commands/registerBranch/branchRegistry';
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

    if (!repo.state) {
        throw new Error('Please open a repo');
    }

    return repo.state.HEAD;
};

export const createBranch = async (
    branchName: string,
    isSwitch: boolean,
    currentBranch: string,
    fromBranch: string
) => {
    if (!gitAPI) {
        throw new Error('Initialize Git API first.');
    }

    const repo = gitAPI.repositories[0];

    if (isSwitch) {
        await repo.checkout(fromBranch);
    }

    await repo.createBranch(branchName, false);

    // got back to the original branch
    await repo.checkout(currentBranch);
};

export const switchToTheBranch = async (branchName: string) => {
    if (!gitAPI) {
        throw new Error('Initialize Git API first.');
    }

    const repo = gitAPI.repositories[0];
    await repo.checkout(branchName);
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

        const registryData = getBranchRegistryRecord(
            getCurrentRepoId(),
            currentBranch
        );

        if (!registryData) {
            return;
        }

        if (!registryData.isExplicitellyStopped) {
            return await startLiveShareSession(currentBranch);
        }

        if (registryData.isExplicitellyStopped) {
            const resumeButton = 'Resume branch';
            const unregisterButton = 'Unregister branch';
            const answer = await vscode.window.showInformationMessage(
                'This branch is registered for broadcast but explicitely paused. Do you want to resume?',
                unregisterButton,
                resumeButton
            );

            if (!answer) {
                return;
            }

            if (answer === resumeButton) {
                resetBranchExplicitelyStopped(
                    getCurrentRepoId(),
                    currentBranch
                );
                return await startLiveShareSession(currentBranch);
            }

            if (answer === unregisterButton) {
                return unregisterBranch(getCurrentRepoId(), currentBranch);
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
