import * as vscode from 'vscode';
import * as vsls from 'vsls';
import { getApi as getVslsApi } from 'vsls';
import {
    addBranchBroadcastGuest,
    getBranchRegistryRecord,
    setLiveshareSessionForBranchRegitryRecord,
} from '../commands/registerBranch/branchRegistry';
import { getCurrentRepoId } from './git';
import { getCurrentSession, startSession } from './slack/session';

// const extractSessionId = (liveshareUrl?: string): string | undefined => {
//     if (typeof liveshareUrl !== 'string' || !liveshareUrl) {
//         return;
//     }

//     const match = liveshareUrl.match(/([a-z|\-]+\.)+liveshare.*\/join(\/)?\?([0-9a-z]{36})/im);

//     if (!match) {
//         return;
//     }

//     return match[3];
// };

let vslsApi: vsls.LiveShare | null = null;
export const initializeLiveShare = async () => {
    vslsApi = await getVslsApi();

    if (!vslsApi) {
        throw new Error('No LiveShare API found.');
    }

    // vslsApi.onDidChangeSession((e) => {
    //     const currentRepoId = getCurrentRepoId();
    //     const currentBranch = getCurrentBranch();
    //     if (!currentBranch || !currentBranch.name || !currentRepoId) {
    //         return;
    //     }
    //     const registryRecord = getBranchRegistryRecord(
    //         currentRepoId,
    //         currentBranch.name
    //     );
    //     if (!registryRecord) {
    //         return;
    //     }
    //     // session ended
    //     if (!e.session.id) {
    //         setBranchExplicitelyStopped(getCurrentRepoId(), currentBranch.name);
    //         return;
    //     }
    //     // session started
    //     if (registryRecord.isExplicitellyStopped) {
    //         resetBranchExplicitelyStopped(
    //             getCurrentRepoId(),
    //             currentBranch.name
    //         );
    //     }
    // });
};

export const startLiveShareSession = async (branchName: string) => {
    if (!vslsApi) {
        throw new Error(
            'No LiveShare API found, call `initializeLiveShare` first.'
        );
    }
    const registryData = getBranchRegistryRecord(
        getCurrentRepoId(),
        branchName
    );

    if (!registryData) {
        throw new Error('No branch record found.');
    }

    const sharedSessionUrl: vscode.Uri | null = await vslsApi.share({
        isPersistent: true,
        sessionId: registryData.sessionId,
        access: registryData.isReadOnly
            ? vsls.Access.ReadOnly
            : vsls.Access.ReadWrite,
    });

    if (!sharedSessionUrl) {
        return;
    }

    if (!registryData.sessionId) {
        setLiveshareSessionForBranchRegitryRecord(
            getCurrentRepoId(),
            branchName,
            sharedSessionUrl.query
        );
    }

    const host = vslsApi.session.user;
    if (!host || !host.id || !host.emailAddress) {
        throw new Error('No host found in the session.');
    }

    addBranchBroadcastGuest(getCurrentRepoId(), branchName, host);

    await startSession(vslsApi, getCurrentRepoId(), branchName);

    vslsApi.onDidChangePeers(async (e) => {
        if (e.removed.length) {
            return;
        }

        const userAdded = e.added[0];
        const { user } = userAdded;

        if (!user || !user.id) {
            throw new Error('User not found or joined without id.');
        }

        addBranchBroadcastGuest(getCurrentRepoId(), branchName, user);
    });

    return sharedSessionUrl;
};

export const stopLiveShareSession = async () => {
    if (!vslsApi) {
        throw new Error(
            'No LiveShare API found, call `initializeLiveShare` first.'
        );
    }

    if (vslsApi.session.id) {
        const promises = [vslsApi.end()];
        const currentSession = getCurrentSession();

        if (currentSession) {
            promises.push(currentSession.dispose());
        }

        await Promise.all(promises);
    }
};
