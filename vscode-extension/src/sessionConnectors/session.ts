import * as vsls from 'vsls';
import { getCurrentRepo } from '../branchBroadcast/git';
import { IRegistryData } from '../commands/registerBranch/branchRegistry';
import { SessionConnectorHub } from './sessionConnectorHub';

export interface IGuest {
    name: string;
    email: string;
    id: string;
}

export interface IMessageRessponeData {
    ok: boolean;
    channel: string;
    ts: string;
}

let currentSession: SessionConnectorHub | undefined;
export const startSession = async (
    vslsApi: vsls.LiveShare,
    repoId: string,
    branchName: string
) => {
    const repo = getCurrentRepo();

    if (!repo) {
        throw new Error('Cannot start session, repo not found.');
    }

    currentSession = new SessionConnectorHub(vslsApi, repoId, branchName, repo);

    await currentSession.init();

    return currentSession;
};

export const stopSession = async (registryData: IRegistryData) => {
    if (!currentSession) {
        return;
    }

    await currentSession.dispose();
    currentSession = undefined;
};

export const getCurrentSession = () => {
    return currentSession;
};
