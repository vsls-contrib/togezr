export interface IGitHubUser {
    id: string;
    login: string;
    name: string;
    bio: string;
    company: string;
    type: 'User' | 'Organization';
    public_repos: number;
    public_gists: number;
    avatar_url: string;
    email: string;
    location: string;
    hireable: boolean;
    followers: number;
    following: number;
    // "login": "legomushroom",
    // "id": 1478800,
    // "node_id": "MDQ6VXNlcjE0Nzg4MDA=",
    // "avatar_url": "https://avatars2.githubusercontent.com/u/1478800?v=4",
    // "gravatar_id": "",
    // "url": "https://api.github.com/users/legomushroom",
    // "html_url": "https://github.com/legomushroom",
    // "followers_url": "https://api.github.com/users/legomushroom/followers",
    // "following_url": "https://api.github.com/users/legomushroom/following{/other_user}",
    // "gists_url": "https://api.github.com/users/legomushroom/gists{/gist_id}",
    // "starred_url": "https://api.github.com/users/legomushroom/starred{/owner}{/repo}",
    // "subscriptions_url": "https://api.github.com/users/legomushroom/subscriptions",
    // "organizations_url": "https://api.github.com/users/legomushroom/orgs",
    // "repos_url": "https://api.github.com/users/legomushroom/repos",
    // "events_url": "https://api.github.com/users/legomushroom/events{/privacy}",
    // "received_events_url": "https://api.github.com/users/legomushroom/received_events",
    // "type": "User",
    // "site_admin": false,
    // "name": "Oleg Solomka",
    // "company": "Microsoft [VS Live Share / VS Online]",
    // "blog": "https://twitter.com/legomushroom",
    // "location": "Seattle, US",
    // "email": "legomushroom@gmail.com",
    // "hireable": true,
    // "bio": "Half stack, part time, award loosing bugs breeder with typing disbabilities.",
    // "public_repos": 170,
    // "public_gists": 10,
    // "followers": 1325,
    // "following": 141,
    // "created_at": "2012-02-27T15:42:33Z",
    // "updated_at": "2020-02-16T02:54:02Z"
}
