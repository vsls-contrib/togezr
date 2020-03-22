interface IShortGitHubUser {
    avatar_url: string;
    events_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    gravatar_id: string;
    html_url: string;
    id: number;
    login: string;
    node_id: string;
    organizations_url: string;
    received_events_url: string;
    repos_url: string;
    site_admin: boolean;
    starred_url: string;
    subscriptions_url: string;
    type: string;
    url: string;
}

declare type IssuesListForRepoResponseItemAssignee = {
    avatar_url: string;
    events_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    gravatar_id: string;
    html_url: string;
    id: number;
    login: string;
    node_id: string;
    organizations_url: string;
    received_events_url: string;
    repos_url: string;
    site_admin: boolean;
    starred_url: string;
    subscriptions_url: string;
    type: string;
    url: string;
};

declare type IssuesListForRepoResponseItemAssigneesItem = {
    avatar_url: string;
    events_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    gravatar_id: string;
    html_url: string;
    id: number;
    login: string;
    node_id: string;
    organizations_url: string;
    received_events_url: string;
    repos_url: string;
    site_admin: boolean;
    starred_url: string;
    subscriptions_url: string;
    type: string;
    url: string;
};

declare type IssuesListForRepoResponseItemLabelsItem = {
    color: string;
    default: boolean;
    description: string;
    id: number;
    name: string;
    node_id: string;
    url: string;
};

declare type IssuesListForRepoResponseItemMilestoneCreator = {
    avatar_url: string;
    events_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    gravatar_id: string;
    html_url: string;
    id: number;
    login: string;
    node_id: string;
    organizations_url: string;
    received_events_url: string;
    repos_url: string;
    site_admin: boolean;
    starred_url: string;
    subscriptions_url: string;
    type: string;
    url: string;
};

declare type IssuesListForRepoResponseItemMilestone = {
    closed_at: string;
    closed_issues: number;
    created_at: string;
    creator: IssuesListForRepoResponseItemMilestoneCreator;
    description: string;
    due_on: string;
    html_url: string;
    id: number;
    labels_url: string;
    node_id: string;
    number: number;
    open_issues: number;
    state: string;
    title: string;
    updated_at: string;
    url: string;
};

declare type IssuesListForRepoResponseItemPullRequest = {
    diff_url: string;
    html_url: string;
    patch_url: string;
    url: string;
};

export interface IShortGitHubIssue {
    active_lock_reason: string;
    body: string;
    closed_at: null;
    comments: number;
    comments_url: string;
    created_at: string;
    events_url: string;
    html_url: string;
    id: number;
    labels_url: string;
    locked: boolean;
    node_id: string;
    number: number;
    repository_url: string;
    state: string;
    title: string;
    updated_at: string;
    url: string;
    assignee: IssuesListForRepoResponseItemAssignee;
    assignees: Array<IssuesListForRepoResponseItemAssigneesItem>;
    labels: Array<IssuesListForRepoResponseItemLabelsItem>;
    milestone: IssuesListForRepoResponseItemMilestone;
    pull_request: IssuesListForRepoResponseItemPullRequest;
    user: IShortGitHubUser;
}
