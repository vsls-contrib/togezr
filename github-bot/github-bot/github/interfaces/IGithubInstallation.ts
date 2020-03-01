import { IGithubUser } from './IGithubUser';

export interface IGithubInstallation {
    id: number;
    events: ('issues' | 'issue_comment' | 'label')[];
    permissions: {
        contents: 'read' | 'write';
        issues: 'read' | 'write';
        metadata: 'read' | 'write';
        statuses: 'read' | 'write';
    };
    account: IGithubUser;

    // "id": 6809523,
    // "account": {
    //     "login": "legomushroom",
    //     "id": 1478800,
    //     "node_id": "MDQ6VXNlcjE0Nzg4MDA=",
    //     "avatar_url": "https://avatars2.githubusercontent.com/u/1478800?v=4",
    //     "gravatar_id": "",
    //     "url": "https://api.github.com/users/legomushroom",
    //     "html_url": "https://github.com/legomushroom",
    //     "followers_url": "https://api.github.com/users/legomushroom/followers",
    //     "following_url": "https://api.github.com/users/legomushroom/following{/other_user}",
    //     "gists_url": "https://api.github.com/users/legomushroom/gists{/gist_id}",
    //     "starred_url": "https://api.github.com/users/legomushroom/starred{/owner}{/repo}",
    //     "subscriptions_url": "https://api.github.com/users/legomushroom/subscriptions",
    //     "organizations_url": "https://api.github.com/users/legomushroom/orgs",
    //     "repos_url": "https://api.github.com/users/legomushroom/repos",
    //     "events_url": "https://api.github.com/users/legomushroom/events{/privacy}",
    //     "received_events_url": "https://api.github.com/users/legomushroom/received_events",
    //     "type": "User",
    //     "site_admin": false
    // },
    // "repository_selection": "selected",
    // "access_tokens_url": "https://api.github.com/app/installations/6809523/access_tokens",
    // "repositories_url": "https://api.github.com/installation/repositories",
    // "html_url": "https://github.com/settings/installations/6809523",
    // "app_id": 52911,
    // "app_slug": "togezr",
    // "target_id": 1478800,
    // "target_type": "User",
    // "permissions": {
    //     "contents": "read",
    //     "issues": "write",
    //     "metadata": "read",
    //     "statuses": "read"
    // },
    // "events": [
    //     "issues",
    //     "issue_comment",
    //     "label"
    // ],
    // "created_at": "2020-02-15T20:00:58.000-08:00",
    // "updated_at": "2020-02-15T20:05:08.000-08:00",
    // "single_file_name": null
}
