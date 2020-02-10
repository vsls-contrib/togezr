import * as vsls from 'vsls';
import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
import { getCurrentRepo } from '../git';
import { SessionReporterHub } from '../sessionReporters/sessionReporterHub';

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

let currentSession: SessionReporterHub | undefined;
export const startSession = async (
    vslsApi: vsls.LiveShare,
    repoId: string,
    branchName: string
) => {
    const repo = getCurrentRepo();

    if (!repo) {
        throw new Error('Cannot start session, repo not found.');
    }

    currentSession = new SessionReporterHub(vslsApi, repoId, branchName, repo);

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
