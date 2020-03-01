import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { handleIssueUpdate } from './github/handleIssueUpdate';
import { IGithubIssue } from './github/interfaces/IGithubIssue';

const issueBody = `
Working on the new live share feature to explore integration with Slack. There are some collaboration opportunities:

🔥 Working on branch broadcasting feature for LiveShare
💥 Integrating with Slack API
🍣 Implementing Slack OAuth flow


![togezr separator](https://aka.ms/togezr-issue-separator-image)

**Live Share:** [![Live Share session](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=4FD34B636D94D437A7DC74DC6670B115BCD6&v=1583020986711)](https://prod.liveshare.vsengsaas.visualstudio.com/join?4FD34B636D94D437A7DC74DC6670B115BCD6)

[<img src="https://avatars3.githubusercontent.com/u/35971525?v=4" width="40" alt="vsls-bot" title="vsls-bot (@vsls-bot) 2 sessions" />](https://github.com/vsls-bot)
**⎇** [oleg-solomka/feature-619338](https://github.com/legomushroom/liveshare-teams/tree/oleg-solomka/feature-619338) [ [⇄ master](https://github.com/legomushroom/liveshare-teams/compare/oleg-solomka/feature-619338) ]

###### powered by [Togezr](https://aka.ms/togezr-issue-website-link)`;

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // context.log('HTTP trigger function processed a request.');

    const { body } = req;

    if (body.action === 'edited' && body.issue as IGithubIssue) {
        await handleIssueUpdate(body);
    }

    // if (body.action === 'edited' && body.issue) {
    //     await handleIssueUpdate(body);
    // }
    
    // const name = (req.query.name || (req.body && req.body.name));

    // if (name) {
    //     context.res = {
    //         // status: 200, /* Defaults to 200 */
    //         body: "Hello " + (req.query.name || req.body.name)
    //     };
    // }
    // else {
    //     context.res = {
    //         status: 400,
    //         body: "Please pass a name on the query string or in the request body"
    //     };
    // }
};

export default httpTrigger;
