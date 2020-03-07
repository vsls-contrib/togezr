import { IGithubIssue } from './IGithubIssue';
import { IGithubRepo } from './IGithubRepo';
import { IGithubUser } from './IGithubUser';

interface IBodyChange {
    from: string;
}

interface IChanges {
    body?: IBodyChange;
}

export interface IGithubIssueEvent {
    action: 'edited' | 'opened' | 'closed' | 'deleted' | 'reopened';
    issue: IGithubIssue;
    changes: IChanges;
    repository: IGithubRepo;
    sender: IGithubUser;
    installation: {
        id: string;
        node_id: string;
    };
}

// "action": "edited",
    // "issue": {
    //     "url": "https://api.github.com/repos/legomushroom/liveshare-teams/issues/9",
    //     "repository_url": "https://api.github.com/repos/legomushroom/liveshare-teams",
    //     "labels_url": "https://api.github.com/repos/legomushroom/liveshare-teams/issues/9/labels{/name}",
    //     "comments_url": "https://api.github.com/repos/legomushroom/liveshare-teams/issues/9/comments",
    //     "events_url": "https://api.github.com/repos/legomushroom/liveshare-teams/issues/9/events",
    //     "html_url": "https://github.com/legomushroom/liveshare-teams/issues/9",
    //     "id": 568041061,
    //     "node_id": "MDU6SXNzdWU1NjgwNDEwNjE=",
    //     "number": 9,
    //     "title": "[Togezr]: Upcoming Live Share sessions",
    //     "user": {
    //         "login": "legomushroom",
    //         "id": 1478800,
    //         "node_id": "MDQ6VXNlcjE0Nzg4MDA=",
    //         "avatar_url": "https://avatars2.githubusercontent.com/u/1478800?v=4",
    //         "gravatar_id": "",
    //         "url": "https://api.github.com/users/legomushroom",
    //         "html_url": "https://github.com/legomushroom",
    //         "followers_url": "https://api.github.com/users/legomushroom/followers",
    //         "following_url": "https://api.github.com/users/legomushroom/following{/other_user}",
    //         "gists_url": "https://api.github.com/users/legomushroom/gists{/gist_id}",
    //         "starred_url": "https://api.github.com/users/legomushroom/starred{/owner}{/repo}",
    //         "subscriptions_url": "https://api.github.com/users/legomushroom/subscriptions",
    //         "organizations_url": "https://api.github.com/users/legomushroom/orgs",
    //         "repos_url": "https://api.github.com/users/legomushroom/repos",
    //         "events_url": "https://api.github.com/users/legomushroom/events{/privacy}",
    //         "received_events_url": "https://api.github.com/users/legomushroom/received_events",
    //         "type": "User",
    //         "site_admin": false
    //     },
    //     "labels": [
    //         {
    //             "id": 1834274228,
    //             "node_id": "MDU6TGFiZWwxODM0Mjc0MjI4",
    //             "url": "https://api.github.com/repos/legomushroom/liveshare-teams/labels/togezr",
    //             "name": "togezr",
    //             "color": "000000",
    //             "default": false,
    //             "description": "Better together."
    //         }
    //     ],
    //     "state": "open",
    //     "locked": false,
    //     "assignee": null,
    //     "assignees": [],
    //     "milestone": null,
    //     "comments": 0,
    //     "created_at": "2020-02-20T04:23:01Z",
    //     "updated_at": "2020-02-29T22:23:43Z",
    //     "closed_at": null,
    //     "author_association": "OWNER",
    //     "body": "**3 Upcoming sessions:**\r\n![togezr separator](https://aka.ms/togezr-issue-separator-image)\r\n[![Live Share session](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=B8B6033309174F05E5167DFF814EF6FF8036&date=Tue%2C%2023%20Feb%202020%2001%3A59%3A08%20GMT&v=1581980348282)](https://prod.liveshare.vsengsaas.visualstudio.com/join?B8B6033309174F05E5167DFF814EF6FF8036) **⎇** [dev/legomushroom/branch-broadcast](https://github.com/legomushroom/liveshare-teams/tree/oleg-solomka/test-111) [ [⇄ master](https://github.com/legomushroom/liveshare-teams/compare/oleg-solomka/test-111) ]\r\n**[[#1](https://github.com/legomushroom/liveshare-teams/issues/1)] Working on branch broadcasting feature for LiveShare**\r\n\r\n[<img src=\"https://avatars0.githubusercontent.com/u/8161247?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars3.githubusercontent.com/u/37163639?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars3.githubusercontent.com/u/18104615?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/3174849?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/16448634?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/312252?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/900690?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars0.githubusercontent.com/u/1794099?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/20570?s=100&v=4\" width=\"40\" alt=\"legomushroom\" title=\"Oleg Solomka (@legomushroom) 23 sessions\" />](https://github.com/legomushroom) [<img src=\"https://avatars3.githubusercontent.com/u/6383490?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/6107272?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/745253?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/13093042?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars0.githubusercontent.com/u/7853870?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot)\r\n![togezr separator](https://aka.ms/togezr-issue-separator-image)\r\n[![Live Share session](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=B8B6033309174F05E5167DFF814EF6FF8036&date=Tue%2C%2024%20Feb%202020%2001%3A59%3A08%20GMT&v=1581980348282)](https://prod.liveshare.vsengsaas.visualstudio.com/join?B8B6033309174F05E5167DFF814EF6FF8036) **⎇** [dev/vsls-bot/liveshare-twitter-integration](https://github.com/legomushroom/liveshare-teams/tree/oleg-solomka/test-111) [ [⇄ master](https://github.com/legomushroom/liveshare-teams/compare/oleg-solomka/test-111) ]\r\n**[[#12](https://github.com)] LiveShare integration into Twitter**\r\n\r\n[<img src=\"https://avatars1.githubusercontent.com/u/116461?s=1000&v=4\" width=\"40\" alt=\"legomushroom\" title=\"Oleg Solomka (@legomushroom) 23 sessions\" />](https://github.com/legomushroom) [<img src=\"https://avatars0.githubusercontent.com/u/38052027?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars0.githubusercontent.com/u/11506344?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars0.githubusercontent.com/u/5965649?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars0.githubusercontent.com/u/585619?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars3.githubusercontent.com/u/6383490?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars3.githubusercontent.com/u/8673199?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/53237948?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/15989459?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot)\r\n![togezr separator](https://aka.ms/togezr-issue-separator-image)\r\n[![Live Share session](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=B8B6033309174F05E5167DFF814EF6FF8036&date=Tue%2C%2028%20Feb%202020%2001%3A59%3A08%20GMT&v=1581980348282)](https://prod.liveshare.vsengsaas.visualstudio.com/join?B8B6033309174F05E5167DFF814EF6FF8036) **⎇** [srivatsn/feature-you-always-wanted](https://github.com/legomushroom/liveshare-teams/tree/oleg-solomka/test-111) [ [⇄ master](https://github.com/legomushroom/liveshare-teams/compare/oleg-solomka/test-111) ]\r\n**[[#23](https://github.com)] Feature that you always wanted**\r\n\r\n[<img src=\"https://avatars1.githubusercontent.com/u/199026?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/51928518?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/7647255?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/4292977?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot)  [<img src=\"https://avatars2.githubusercontent.com/u/1478800?v=4\" width=\"40\" alt=\"legomushroom\" title=\"Oleg Solomka (@legomushroom) 23 sessions\" />](https://github.com/legomushroom) [<img src=\"https://avatars0.githubusercontent.com/u/12283206?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars3.githubusercontent.com/u/8239356?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) \r\n\r\n###### powered by [Togezr](https://aka.ms/togezr-issue-website-link)\r\n."
    // },
    // "changes": {
    //     "body": {
    //         "from": "**3 Upcoming sessions:**\r\n![togezr separator](https://aka.ms/togezr-issue-separator-image)\r\n[![Live Share session](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=B8B6033309174F05E5167DFF814EF6FF8036&date=Tue%2C%2023%20Feb%202020%2001%3A59%3A08%20GMT&v=1581980348282)](https://prod.liveshare.vsengsaas.visualstudio.com/join?B8B6033309174F05E5167DFF814EF6FF8036) **⎇** [dev/legomushroom/branch-broadcast](https://github.com/legomushroom/liveshare-teams/tree/oleg-solomka/test-111) [ [⇄ master](https://github.com/legomushroom/liveshare-teams/compare/oleg-solomka/test-111) ]\r\n**[[#1](https://github.com/legomushroom/liveshare-teams/issues/1)] Working on branch broadcasting feature for LiveShare**\r\n\r\n[<img src=\"https://avatars0.githubusercontent.com/u/8161247?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars3.githubusercontent.com/u/37163639?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars3.githubusercontent.com/u/18104615?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/3174849?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/16448634?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/312252?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/900690?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars0.githubusercontent.com/u/1794099?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/20570?s=100&v=4\" width=\"40\" alt=\"legomushroom\" title=\"Oleg Solomka (@legomushroom) 23 sessions\" />](https://github.com/legomushroom) [<img src=\"https://avatars3.githubusercontent.com/u/6383490?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/6107272?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/745253?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/13093042?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars0.githubusercontent.com/u/7853870?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot)\r\n![togezr separator](https://aka.ms/togezr-issue-separator-image)\r\n[![Live Share session](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=B8B6033309174F05E5167DFF814EF6FF8036&date=Tue%2C%2024%20Feb%202020%2001%3A59%3A08%20GMT&v=1581980348282)](https://prod.liveshare.vsengsaas.visualstudio.com/join?B8B6033309174F05E5167DFF814EF6FF8036) **⎇** [dev/vsls-bot/liveshare-twitter-integration](https://github.com/legomushroom/liveshare-teams/tree/oleg-solomka/test-111) [ [⇄ master](https://github.com/legomushroom/liveshare-teams/compare/oleg-solomka/test-111) ]\r\n**[[#12](https://github.com)] LiveShare integration into Twitter**\r\n\r\n[<img src=\"https://avatars1.githubusercontent.com/u/116461?s=1000&v=4\" width=\"40\" alt=\"legomushroom\" title=\"Oleg Solomka (@legomushroom) 23 sessions\" />](https://github.com/legomushroom) [<img src=\"https://avatars0.githubusercontent.com/u/38052027?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars0.githubusercontent.com/u/11506344?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars0.githubusercontent.com/u/5965649?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars0.githubusercontent.com/u/585619?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars3.githubusercontent.com/u/6383490?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars3.githubusercontent.com/u/8673199?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/53237948?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/15989459?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot)\r\n![togezr separator](https://aka.ms/togezr-issue-separator-image)\r\n[![Live Share session](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=B8B6033309174F05E5167DFF814EF6FF8036&date=Tue%2C%2028%20Feb%202020%2001%3A59%3A08%20GMT&v=1581980348282)](https://prod.liveshare.vsengsaas.visualstudio.com/join?B8B6033309174F05E5167DFF814EF6FF8036) **⎇** [srivatsn/feature-you-always-wanted](https://github.com/legomushroom/liveshare-teams/tree/oleg-solomka/test-111) [ [⇄ master](https://github.com/legomushroom/liveshare-teams/compare/oleg-solomka/test-111) ]\r\n**[[#23](https://github.com)] Feature that you always wanted**\r\n\r\n[<img src=\"https://avatars1.githubusercontent.com/u/199026?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/51928518?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars1.githubusercontent.com/u/7647255?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars2.githubusercontent.com/u/4292977?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot)  [<img src=\"https://avatars2.githubusercontent.com/u/1478800?v=4\" width=\"40\" alt=\"legomushroom\" title=\"Oleg Solomka (@legomushroom) 23 sessions\" />](https://github.com/legomushroom) [<img src=\"https://avatars0.githubusercontent.com/u/12283206?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) [<img src=\"https://avatars3.githubusercontent.com/u/8239356?s=100&v=4\" width=\"40\" alt=\"vsls-bot\" title=\"vsls-bot (@vsls-bot) 5 sessions\" />](https://github.com/vsls-bot) \r\n\r\n###### powered by [Togezr](https://aka.ms/togezr-issue-website-link)"
    //     }
    // },
    // "repository": {
    //     "id": 236394433,
    //     "node_id": "MDEwOlJlcG9zaXRvcnkyMzYzOTQ0MzM=",
    //     "name": "liveshare-teams",
    //     "full_name": "legomushroom/liveshare-teams",
    //     "private": true,
    //     "owner": {
    //         "login": "legomushroom",
    //         "id": 1478800,
    //         "node_id": "MDQ6VXNlcjE0Nzg4MDA=",
    //         "avatar_url": "https://avatars2.githubusercontent.com/u/1478800?v=4",
    //         "gravatar_id": "",
    //         "url": "https://api.github.com/users/legomushroom",
    //         "html_url": "https://github.com/legomushroom",
    //         "followers_url": "https://api.github.com/users/legomushroom/followers",
    //         "following_url": "https://api.github.com/users/legomushroom/following{/other_user}",
    //         "gists_url": "https://api.github.com/users/legomushroom/gists{/gist_id}",
    //         "starred_url": "https://api.github.com/users/legomushroom/starred{/owner}{/repo}",
    //         "subscriptions_url": "https://api.github.com/users/legomushroom/subscriptions",
    //         "organizations_url": "https://api.github.com/users/legomushroom/orgs",
    //         "repos_url": "https://api.github.com/users/legomushroom/repos",
    //         "events_url": "https://api.github.com/users/legomushroom/events{/privacy}",
    //         "received_events_url": "https://api.github.com/users/legomushroom/received_events",
    //         "type": "User",
    //         "site_admin": false
    //     },
    //     "html_url": "https://github.com/legomushroom/liveshare-teams",
    //     "description": "Live Share 💜Teams",
    //     "fork": false,
    //     "url": "https://api.github.com/repos/legomushroom/liveshare-teams",
    //     "forks_url": "https://api.github.com/repos/legomushroom/liveshare-teams/forks",
    //     "keys_url": "https://api.github.com/repos/legomushroom/liveshare-teams/keys{/key_id}",
    //     "collaborators_url": "https://api.github.com/repos/legomushroom/liveshare-teams/collaborators{/collaborator}",
    //     "teams_url": "https://api.github.com/repos/legomushroom/liveshare-teams/teams",
    //     "hooks_url": "https://api.github.com/repos/legomushroom/liveshare-teams/hooks",
    //     "issue_events_url": "https://api.github.com/repos/legomushroom/liveshare-teams/issues/events{/number}",
    //     "events_url": "https://api.github.com/repos/legomushroom/liveshare-teams/events",
    //     "assignees_url": "https://api.github.com/repos/legomushroom/liveshare-teams/assignees{/user}",
    //     "branches_url": "https://api.github.com/repos/legomushroom/liveshare-teams/branches{/branch}",
    //     "tags_url": "https://api.github.com/repos/legomushroom/liveshare-teams/tags",
    //     "blobs_url": "https://api.github.com/repos/legomushroom/liveshare-teams/git/blobs{/sha}",
    //     "git_tags_url": "https://api.github.com/repos/legomushroom/liveshare-teams/git/tags{/sha}",
    //     "git_refs_url": "https://api.github.com/repos/legomushroom/liveshare-teams/git/refs{/sha}",
    //     "trees_url": "https://api.github.com/repos/legomushroom/liveshare-teams/git/trees{/sha}",
    //     "statuses_url": "https://api.github.com/repos/legomushroom/liveshare-teams/statuses/{sha}",
    //     "languages_url": "https://api.github.com/repos/legomushroom/liveshare-teams/languages",
    //     "stargazers_url": "https://api.github.com/repos/legomushroom/liveshare-teams/stargazers",
    //     "contributors_url": "https://api.github.com/repos/legomushroom/liveshare-teams/contributors",
    //     "subscribers_url": "https://api.github.com/repos/legomushroom/liveshare-teams/subscribers",
    //     "subscription_url": "https://api.github.com/repos/legomushroom/liveshare-teams/subscription",
    //     "commits_url": "https://api.github.com/repos/legomushroom/liveshare-teams/commits{/sha}",
    //     "git_commits_url": "https://api.github.com/repos/legomushroom/liveshare-teams/git/commits{/sha}",
    //     "comments_url": "https://api.github.com/repos/legomushroom/liveshare-teams/comments{/number}",
    //     "issue_comment_url": "https://api.github.com/repos/legomushroom/liveshare-teams/issues/comments{/number}",
    //     "contents_url": "https://api.github.com/repos/legomushroom/liveshare-teams/contents/{+path}",
    //     "compare_url": "https://api.github.com/repos/legomushroom/liveshare-teams/compare/{base}...{head}",
    //     "merges_url": "https://api.github.com/repos/legomushroom/liveshare-teams/merges",
    //     "archive_url": "https://api.github.com/repos/legomushroom/liveshare-teams/{archive_format}{/ref}",
    //     "downloads_url": "https://api.github.com/repos/legomushroom/liveshare-teams/downloads",
    //     "issues_url": "https://api.github.com/repos/legomushroom/liveshare-teams/issues{/number}",
    //     "pulls_url": "https://api.github.com/repos/legomushroom/liveshare-teams/pulls{/number}",
    //     "milestones_url": "https://api.github.com/repos/legomushroom/liveshare-teams/milestones{/number}",
    //     "notifications_url": "https://api.github.com/repos/legomushroom/liveshare-teams/notifications{?since,all,participating}",
    //     "labels_url": "https://api.github.com/repos/legomushroom/liveshare-teams/labels{/name}",
    //     "releases_url": "https://api.github.com/repos/legomushroom/liveshare-teams/releases{/id}",
    //     "deployments_url": "https://api.github.com/repos/legomushroom/liveshare-teams/deployments",
    //     "created_at": "2020-01-27T00:06:32Z",
    //     "updated_at": "2020-02-15T05:07:33Z",
    //     "pushed_at": "2020-02-21T22:47:39Z",
    //     "git_url": "git://github.com/legomushroom/liveshare-teams.git",
    //     "ssh_url": "git@github.com:legomushroom/liveshare-teams.git",
    //     "clone_url": "https://github.com/legomushroom/liveshare-teams.git",
    //     "svn_url": "https://github.com/legomushroom/liveshare-teams",
    //     "homepage": null,
    //     "size": 175,
    //     "stargazers_count": 0,
    //     "watchers_count": 0,
    //     "language": "JavaScript",
    //     "has_issues": true,
    //     "has_projects": true,
    //     "has_downloads": true,
    //     "has_wiki": true,
    //     "has_pages": false,
    //     "forks_count": 0,
    //     "mirror_url": null,
    //     "archived": false,
    //     "disabled": false,
    //     "open_issues_count": 3,
    //     "license": {
    //         "key": "mit",
    //         "name": "MIT License",
    //         "spdx_id": "MIT",
    //         "url": "https://api.github.com/licenses/mit",
    //         "node_id": "MDc6TGljZW5zZTEz"
    //     },
    //     "forks": 0,
    //     "open_issues": 3,
    //     "watchers": 0,
    //     "default_branch": "master"
    // },
    // "sender": {
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
    // "installation": {
    //     "id": 7038367,
    //     "node_id": "MDIzOkludGVncmF0aW9uSW5zdGFsbGF0aW9uNzAzODM2Nw=="
    // }
    