import { ISlackTeam } from './ISlackTeam';
import {
    GITHUB_ACCOUNT_TYPE,
    SLACK_ACCOUNT_TYPE,
    TAccountType,
    TEAMS_ACCOUNT_TYPE,
} from './TAccountType';

export type TAccountRecord =
    | ISlackAccountRecord
    | ITeamsAccountRecord
    | IGitHubAccountRecord;

export interface IAccountRecord {
    type: TAccountType;
    name: string;
    token: string;
}

export interface ISlackAccountRecord extends IAccountRecord {
    type: typeof SLACK_ACCOUNT_TYPE;
    team: ISlackTeam;
}

export interface ITeamsAccountRecord extends IAccountRecord {
    type: typeof TEAMS_ACCOUNT_TYPE;
}

export interface IGitHubAccountRecord extends IAccountRecord {
    type: typeof GITHUB_ACCOUNT_TYPE;
}
