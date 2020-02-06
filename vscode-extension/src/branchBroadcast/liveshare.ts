import * as vscode from 'vscode';
import * as vsls from 'vsls';
import { getApi as getVslsApi } from 'vsls';
import {
    getBranchRegistryRecord,
    setLiveshareSessionForBranchRegitryRecord,
} from '../commands/registerBranch/branchRegistry';
import { startSession } from './slack/session';

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
};

export const startLiveShareSession = async (branchName: string) => {
    if (!vslsApi) {
        throw new Error(
            'No LiveShare API found, call `initializeLiveShare` first.'
        );
    }
    const registryData = getBranchRegistryRecord(branchName);

    if (!registryData) {
        throw new Error('No branch record found.');
    }

    const sharedSessionUrl: vscode.Uri | null = await vslsApi.share({
        isPersistent: true,
        sessionId: registryData.sessionId,
    });

    if (!sharedSessionUrl) {
        return;
    }

    if (!registryData.sessionId) {
        setLiveshareSessionForBranchRegitryRecord(
            branchName,
            sharedSessionUrl.query
        );
    }

    const session = startSession(registryData);
    await session.sendMesage();

    return sharedSessionUrl;
};

export const stopLiveShareSession = async () => {
    if (!vslsApi) {
        throw new Error(
            'No LiveShare API found, call `initializeLiveShare` first.'
        );
    }

    if (vslsApi.session.id) {
        await vslsApi.end();
    }
};
