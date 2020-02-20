import { IGitHubUser } from './IGitHubUser';

interface IGithubRepoPermissions {
    admin: boolean;
    push: boolean;
    pull: boolean;
}

export interface IGithubRepo {
    id: string;
    default_branch: string;
    name: string;
    full_name: string;
    private: boolean;
    fork: boolean;
    html_url: string;
    description: string;
    open_issues: number;
    forks: number;
    watchers: number;
    permissions: IGithubRepoPermissions;
    owner: IGitHubUser;
    // "id": 108537191,
    // "node_id": "MDEwOlJlcG9zaXRvcnkxMDg1MzcxOTE=",
    // "name": "EntityFramework.Docs.pl-pl",
    // "full_name": "aspnet/EntityFramework.Docs.pl-pl",
    // "private": false,
    // "owner": {
    //     "login": "aspnet",
    //     "id": 6476660,
    //     "node_id": "MDEyOk9yZ2FuaXphdGlvbjY0NzY2NjA=",
    //     "avatar_url": "https://avatars3.githubusercontent.com/u/6476660?v=4",
    //     "gravatar_id": "",
    //     "url": "https://api.github.com/users/aspnet",
    //     "html_url": "https://github.com/aspnet",
    //     "followers_url": "https://api.github.com/users/aspnet/followers",
    //     "following_url": "https://api.github.com/users/aspnet/following{/other_user}",
    //     "gists_url": "https://api.github.com/users/aspnet/gists{/gist_id}",
    //     "starred_url": "https://api.github.com/users/aspnet/starred{/owner}{/repo}",
    //     "subscriptions_url": "https://api.github.com/users/aspnet/subscriptions",
    //     "organizations_url": "https://api.github.com/users/aspnet/orgs",
    //     "repos_url": "https://api.github.com/users/aspnet/repos",
    //     "events_url": "https://api.github.com/users/aspnet/events{/privacy}",
    //     "received_events_url": "https://api.github.com/users/aspnet/received_events",
    //     "type": "Organization",
    //     "site_admin": false
    // },
    // "html_url": "https://github.com/aspnet/EntityFramework.Docs.pl-pl",
    // "description": "Documentation for Entity Framework",
    // "fork": false,
    // "url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl",
    // "forks_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/forks",
    // "keys_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/keys{/key_id}",
    // "collaborators_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/collaborators{/collaborator}",
    // "teams_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/teams",
    // "hooks_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/hooks",
    // "issue_events_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/issues/events{/number}",
    // "events_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/events",
    // "assignees_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/assignees{/user}",
    // "branches_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/branches{/branch}",
    // "tags_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/tags",
    // "blobs_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/git/blobs{/sha}",
    // "git_tags_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/git/tags{/sha}",
    // "git_refs_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/git/refs{/sha}",
    // "trees_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/git/trees{/sha}",
    // "statuses_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/statuses/{sha}",
    // "languages_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/languages",
    // "stargazers_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/stargazers",
    // "contributors_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/contributors",
    // "subscribers_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/subscribers",
    // "subscription_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/subscription",
    // "commits_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/commits{/sha}",
    // "git_commits_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/git/commits{/sha}",
    // "comments_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/comments{/number}",
    // "issue_comment_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/issues/comments{/number}",
    // "contents_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/contents/{+path}",
    // "compare_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/compare/{base}...{head}",
    // "merges_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/merges",
    // "archive_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/{archive_format}{/ref}",
    // "downloads_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/downloads",
    // "issues_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/issues{/number}",
    // "pulls_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/pulls{/number}",
    // "milestones_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/milestones{/number}",
    // "notifications_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/notifications{?since,all,participating}",
    // "labels_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/labels{/name}",
    // "releases_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/releases{/id}",
    // "deployments_url": "https://api.github.com/repos/aspnet/EntityFramework.Docs.pl-pl/deployments",
    // "created_at": "2017-10-27T11:20:54Z",
    // "updated_at": "2020-02-10T22:44:49Z",
    // "pushed_at": "2020-02-10T22:45:41Z",
    // "git_url": "git://github.com/aspnet/EntityFramework.Docs.pl-pl.git",
    // "ssh_url": "git@github.com:aspnet/EntityFramework.Docs.pl-pl.git",
    // "clone_url": "https://github.com/aspnet/EntityFramework.Docs.pl-pl.git",
    // "svn_url": "https://github.com/aspnet/EntityFramework.Docs.pl-pl",
    // "homepage": null,
    // "size": 6288,
    // "stargazers_count": 0,
    // "watchers_count": 0,
    // "language": "PowerShell",
    // "has_issues": true,
    // "has_projects": true,
    // "has_downloads": true,
    // "has_wiki": true,
    // "has_pages": false,
    // "forks_count": 5,
    // "mirror_url": null,
    // "archived": false,
    // "disabled": false,
    // "open_issues_count": 0,
    // "license": {
    //     "key": "mit",
    //     "name": "MIT License",
    //     "spdx_id": "MIT",
    //     "url": "https://api.github.com/licenses/mit",
    //     "node_id": "MDc6TGljZW5zZTEz"
    // },
    // "forks": 5,
    // "open_issues": 0,
    // "watchers": 0,
    // "default_branch": "live",
    // "permissions": {
    //     "admin": false,
    //     "push": false,
    //     "pull": true
    // }
}
