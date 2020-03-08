const GITHUB_ACCOUNT_TYPE = 'GitHub';
const SLACK_ACCOUNT_TYPE = 'Slack';
const TEAMS_ACCOUNT_TYPE = 'Teams';

export type TAccountType =
    | typeof GITHUB_ACCOUNT_TYPE
    | typeof SLACK_ACCOUNT_TYPE
    | typeof TEAMS_ACCOUNT_TYPE;

export const KNOWN_ACCOUNT_TYPES: TAccountType[] = [
    GITHUB_ACCOUNT_TYPE,
    SLACK_ACCOUNT_TYPE,
    TEAMS_ACCOUNT_TYPE,
];
