import * as vsls from 'vsls';
import { getCurrentRepo } from '../branchBroadcast/git';
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
export const startSession = async (vslsApi: vsls.LiveShare, id: string) => {
    const repo = getCurrentRepo();

    if (!repo) {
        throw new Error('Cannot start session, repo not found.');
    }

    currentSession = new SessionConnectorHub(vslsApi, id, repo);

    await currentSession.init();

    return currentSession;
};

export const disposeCurrentSessionIfPresent = async () => {
    if (!currentSession) {
        return;
    }

    await currentSession.dispose();
    currentSession = undefined;
};

export const getCurrentSession = () => {
    return currentSession;
};
