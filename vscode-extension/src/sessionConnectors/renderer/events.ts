import * as vsls from 'vsls';

interface ISessionEventBase {
    type: 'start-session' | 'end-session' | 'guest-join' | 'commit-push';
    timestamp: number;
}

export interface ISessionStartEvent extends ISessionEventBase {
    type: 'start-session';
    sessionId: string;
    user: vsls.UserInfo;
}

interface ISessionEndEvent extends ISessionEventBase {
    type: 'end-session';
}

export interface ISessionUserJoinEvent extends ISessionEventBase {
    type: 'guest-join';
    user: vsls.UserInfo;
}

interface ISessionCommitPushEvent extends ISessionEventBase {
    type: 'commit-push';
    commitId: string;
    commitMessage: string;
    repoUrl: string;
}

export type ISessionEvent =
    | ISessionUserJoinEvent
    | ISessionCommitPushEvent
    | ISessionStartEvent
    | ISessionEndEvent;
