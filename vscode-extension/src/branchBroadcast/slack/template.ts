// import { IRegistryData } from '../../commands/registerBranch/branchRegistry';

// export interface ITemplateOptions {
//     // channelId: string;
//     authorUserId: string;
//     authorUserName: string;
//     // liveshareSessionId: string;
//     guests: ISessionGuest[];
//     threadTs?: string;
//     registryData: IRegistryData;
// }

// export const getIssueNumber = (githubIssueUrl: string) => {
//     const split = githubIssueUrl.split('/');
//     const issueNumber = split[6];

//     return issueNumber;
// };

// export interface ISessionGuest {
//     name: string;
//     imageUrl: string;
// }

// const renderGuests = (options: ITemplateOptions) => {
//     const { guests } = options;

//     if (!guests.length) {
//         return '';
//     }

//     const renderedGuests: any[] = guests.map((guest) => {
//         return {
//             type: 'image',
//             image_url: guest.imageUrl,
//             alt_text: guest.name,
//         };
//     });

//     const suffix = renderedGuests.length === 1 ? '' : 's';
//     renderedGuests.push({
//         type: 'mrkdwn',
//         text: `*${renderedGuests.length} guest${suffix}*`,
//     });

//     return `{
//         "type": "context",
//         "elements": ${JSON.stringify(renderedGuests, null, 2)}
//     },
//     {
//         "type": "divider"
//     },`;
// };

// const renderThreadTs = (options: ITemplateOptions) => {
//     const { threadTs } = options;
//     if (!threadTs) {
//         return '';
//     }

//     return `"ts": "${threadTs}",`;
// };

// export const template = (options: ITemplateOptions) => {
//     const { registryData } = options;
//     const { channel, sessionId, githubIssue } = registryData;

//     return `{
//         "channel": "${channel.url}",
//         "text": "${options.authorUserName} started collaboration session",
//         ${renderThreadTs(options)}
//         "blocks": [
//             {
//                 "type": "divider"
//             },
//                 {
//                     "type": "section",
//                     "text": {
//                         "type": "mrkdwn",
//                         "text": "<${options.authorUserId}|${
//         options.authorUserName
//     }> started <vscode://ms-vsliveshare.vsliveshare/join?${sessionId}|LiveShare session>."
//                     },
//                     "accessory": {
//                         "type": "button",
//                         "text": {
//                             "type": "plain_text",
//                             "text": "⚡ Live",
//                             "emoji": true
//                         }
//                     }
//                 },
//               {
//                   "type": "divider"
//               },
//               {
//                   "type": "section",
//                   "text": {
//                       "type": "mrkdwn",
//                       "text": "[<${githubIssue}|#${getIssueNumber(
//         githubIssue
//     )}>] *Working on branch broadcasting feature for LiveShare* \n Working on the new live share feature to explore integration with Slack. There are some collaboration opportunities: \n\n - :fire: Working on branch broadcasting feature for LiveShare \n - :collision: Integrating with Slack API \n - :sushi: Implementing Slack OAuth flow"
//                   },
//                   "accessory": {
//                       "type": "image",
//                       "image_url": "https://avatars1.githubusercontent.com/u/1478800?s=460&v=4",
//                       "alt_text": "plants"
//                   }
//               },
//               {
//                   "type": "divider"
//               },
//               ${renderGuests(options)}
//               {
//                 "type": "section",
//                 "text": {
//                         "type": "mrkdwn",
//                         "text": "*[ <vscode://ms-vsliveshare.vsliveshare/join?${sessionId}|Join in VSCode> ]*\n\n"
//                 }
//             },
//             {
//                 "type": "divider"
//             }
//           ]
//       }`;
// };
