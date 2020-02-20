export interface IGistFile {
    file: string;
    type: string;
    language: string;
    raw_url: string;
    size: number;
    truncated: boolean;
    content: string;
}

export interface IGist {
    id: string;
    html_url: string;
    file: { [name: string]: IGistFile };
    public: boolean;
    truncated: boolean;
    updated_at: string;
    description: string;
    // "url": "https://api.github.com/gists/5f63d9deccecb62f56ad79b43b92fd28",
    // "forks_url": "https://api.github.com/gists/5f63d9deccecb62f56ad79b43b92fd28/forks",
    // "commits_url": "https://api.github.com/gists/5f63d9deccecb62f56ad79b43b92fd28/commits",
    // "id": "5f63d9deccecb62f56ad79b43b92fd28",
    // "node_id": "MDQ6R2lzdDVmNjNkOWRlY2NlY2I2MmY1NmFkNzliNDNiOTJmZDI4",
    // "git_pull_url": "https://gist.github.com/5f63d9deccecb62f56ad79b43b92fd28.git",
    // "git_push_url": "https://gist.github.com/5f63d9deccecb62f56ad79b43b92fd28.git",
    // "html_url": "https://gist.github.com/5f63d9deccecb62f56ad79b43b92fd28",
    // "files": {
    //     "index.json": {
    //         "filename": "index.json",
    //         "type": "application/json",
    //         "language": "JSON",
    //         "raw_url": "https://gist.githubusercontent.com/legomushroom/5f63d9deccecb62f56ad79b43b92fd28/raw/9e26dfeeb6e641a33dae4961196235bdb965b21b/index.json",
    //         "size": 2,
    //         "truncated": false,
    //         "content": "{}"
    //     }
    // },
    // "public": false,
    // "created_at": "2020-02-20T01:32:55Z",
    // "updated_at": "2020-02-20T01:32:55Z",
    // "description": "Togezr LiveShare sessions schedule",
    // "comments": 0,
    // "user": null,
    // "comments_url": "https://api.github.com/gists/5f63d9deccecb62f56ad79b43b92fd28/comments",
    // "owner": {
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
    // "forks": [],
    // "history": [
    //     {
    //         "user": {
    //             "login": "legomushroom",
    //             "id": 1478800,
    //             "node_id": "MDQ6VXNlcjE0Nzg4MDA=",
    //             "avatar_url": "https://avatars2.githubusercontent.com/u/1478800?v=4",
    //             "gravatar_id": "",
    //             "url": "https://api.github.com/users/legomushroom",
    //             "html_url": "https://github.com/legomushroom",
    //             "followers_url": "https://api.github.com/users/legomushroom/followers",
    //             "following_url": "https://api.github.com/users/legomushroom/following{/other_user}",
    //             "gists_url": "https://api.github.com/users/legomushroom/gists{/gist_id}",
    //             "starred_url": "https://api.github.com/users/legomushroom/starred{/owner}{/repo}",
    //             "subscriptions_url": "https://api.github.com/users/legomushroom/subscriptions",
    //             "organizations_url": "https://api.github.com/users/legomushroom/orgs",
    //             "repos_url": "https://api.github.com/users/legomushroom/repos",
    //             "events_url": "https://api.github.com/users/legomushroom/events{/privacy}",
    //             "received_events_url": "https://api.github.com/users/legomushroom/received_events",
    //             "type": "User",
    //             "site_admin": false
    //         },
    //         "version": "69100fdc86d3ee02289279cdc3d75b06eaed9d27",
    //         "committed_at": "2020-02-20T01:32:54Z",
    //         "change_status": {
    //             "total": 1,
    //             "additions": 1,
    //             "deletions": 0
    //         },
    //         "url": "https://api.github.com/gists/5f63d9deccecb62f56ad79b43b92fd28/69100fdc86d3ee02289279cdc3d75b06eaed9d27"
    //     }
    // ],
    // "truncated": false
}
