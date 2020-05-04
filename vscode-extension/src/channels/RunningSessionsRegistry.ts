import { lsApi } from '../branchBroadcast/liveshare';
import { TChannel } from '../interfaces/TChannel';
import * as memento from '../memento';

const SESSIONS_KEY = 'RUNNING_SESSIONS_REGISTRY';

interface IRunningChannelSession {
    sessionId: string;
    channel: TChannel;
    // session: ChannelSession;
    // branchName?: string;
    // repoName?: string;
}

class RunningSessionsRegistry {
    public add = (sessionToSet: IRunningChannelSession) => {
        const currentSessions = this.getSessions();

        const newSessions = currentSessions.filter((session) => {
            return sessionToSet.sessionId !== session.sessionId;
        });

        newSessions.push(sessionToSet);

        memento.set(SESSIONS_KEY, newSessions);
    };

    public getSessions = (): IRunningChannelSession[] => {
        return memento.get(SESSIONS_KEY) || [];
    };

    public remove = (sessionToRemove: IRunningChannelSession) => {
        const currentSessions = this.getSessions();

        const newSessions = currentSessions.filter((session) => {
            return sessionToRemove.sessionId !== session.sessionId;
        });

        return memento.set(SESSIONS_KEY, newSessions);
    };

    public getActivelyRunningSession = (): IRunningChannelSession | null => {
        const sessions = this.getSessions();

        const lsAPI = lsApi();

        const { id } = lsAPI.session;
        if (!id) {
            return null;
        }

        const session = sessions.find((s) => {
            return id === s.sessionId;
        });

        return session || null;
    };

    public removeActivelyRunningSession = (): this => {
        const session = this.getActivelyRunningSession();

        if (!session) {
            return this;
        }

        this.remove(session);

        return this;
    };
}

export const runningSessionsRegistry = new RunningSessionsRegistry();
