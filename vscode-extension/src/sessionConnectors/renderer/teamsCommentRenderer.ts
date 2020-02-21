// const time = require('pretty-ms');
import * as path from 'path';
import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
import { IGitHubConnector } from '../../connectorRepository/connectorRepository';
import { IGithubConnectorData } from '../../interfaces/IGithubConnectorData';
import { User } from '../../user';
import { cleanupGithubIssueDescription } from '../../utils/cleanupGithubIssueDescription';
import { getRepoUrlFromIssueUrl } from '../github/getRepoUrlFromIssueUrl';
import { ISessionEvent, ISessionStartEvent } from './events';

const renderText = (githubConnector?: IGitHubConnector) => {
    if (!githubConnector) {
        return '';
    }

    if (!githubConnector.data) {
        throw new Error('No connector data set.');
    }

    const { githubIssue } = githubConnector.data as IGithubConnectorData;

    const title = githubIssue.title;
    const cleanBody = cleanupGithubIssueDescription(githubIssue.body);

    return `**[[#${githubIssue.number}](${githubIssue.html_url})] ${title}**                                     \n ${cleanBody}`;
};

const renderGithubRepoInfo = (
    registryData: IRegistryData,
    githubConnector?: IGitHubConnector
) => {
    const repoName = path.basename(registryData.repoRootPath);

    if (githubConnector) {
        if (!githubConnector.data) {
            throw new Error('No GitHub connector data set.');
        }

        const { githubIssue } = githubConnector.data;
        const { branchName } = registryData;

        const repoUrl = getRepoUrlFromIssueUrl(githubIssue.html_url);

        return `{
            "name": "Repository:",
            "value": "[${repoName}](${repoUrl}) [[⎇${branchName}](${repoUrl}/tree/${branchName})]"
        }`;
    }

    return `{
        "name": "Repository:",
        "value": "${repoName} [⎇${registryData.branchName}]"
    }`;
};

export class TeamsCommentRenderer {
    constructor(
        private registryData: IRegistryData,
        private githubConnector?: IGitHubConnector
    ) {}

    public render = async (events: ISessionEvent[]) => {
        const sessionStart = events[0] as ISessionStartEvent;

        const { sessionId } = sessionStart;

        const host = new User(sessionStart.user);

        const lsSessionLink = `https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId}`;

        return `{
            "@type": "MessageCard",
            "@context": "https://schema.org/extensions",
            "summary": "${host.displayName} started Live Share session",
            "title": "${host.displayName} started Live Share session",
            "sections": [
                {
                    "activityTitle": "${host.displayName}",
                    "activitySubtitle": "${new Date(
                        sessionStart.timestamp
                    ).toString()}",
                    "activityImage": "${await host.getUserAvatarLink()}",
                    "facts": [
                        {
                            "name": "Session:",
                            "value": "[${lsSessionLink}](${lsSessionLink}) [![](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=${sessionId})](${lsSessionLink})"
                        },
                        ${renderGithubRepoInfo(
                            this.registryData,
                            this.githubConnector
                        )}
                    ],
                    "text": "${renderText(this.githubConnector)}"
                }
            ],
            "potentialAction": [
                {
                    "@type": "OpenUri",
                    "name": "Join the Session",
                    "targets": [
                        {
                            "os": "default",
                            "uri": "${lsSessionLink}"
                        }
                    ]
                }
            ]
        }`;
    };
}
