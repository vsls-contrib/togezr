import { ChannelSession } from '../../channels/ChannelSession';
import { IGitHubRepoIssueChannel } from '../../interfaces/IGitHubRepoIssueChannel';
import {
    ISessionEvent,
    ISessionStartEvent,
} from '../../sessionConnectors/renderer/events';
import { User } from '../../user';

export const renderText = (githubChannel?: IGitHubRepoIssueChannel) => {
    if (!githubChannel) {
        return 'Hello World.';
    }

    /**
     * TODO: implement rendering of GH Issue details
     */
    return '';
    // if (!githubChannel.data) {
    //     throw new Error('No connector data set.');
    // }

    // const { githubIssue } = githubConnector.data as IGithubConnectorData;

    // const title = githubIssue.title;
    // const cleanBody = cleanupGithubIssueDescription(githubIssue.body);

    // return `**[[#${githubIssue.number}](${githubIssue.html_url})] ${title}**                                              \\n\\n ${cleanBody}`;
};

export const renderGithubRepoInfo = (channels: ChannelSession[]) => {
    /**
     * TODO: implement rendering of GH Issue details
     */
    return [];

    // const repoName = path.basename(registryData.repoRootPath);

    // if (githubConnector) {
    //     if (!githubConnector.data) {
    //         throw new Error('No GitHub connector data set.');
    //     }

    //     const { githubIssue } = githubConnector.data;
    //     const { branchName } = registryData;

    //     const repoUrl = getRepoUrlFromIssueUrl(githubIssue.html_url);

    //     return `{
    //         "name": "Repository:",
    //         "value": "[${repoName}](${repoUrl}) [[⎇${branchName}](${repoUrl}/tree/${branchName})]"
    //     }`;
    // }

    // return `{
    //     "name": "Repository:",
    //     "value": "${repoName} [⎇${registryData.branchName}]"
    // }`;
};

export const renderTeamsBody = async (
    events: ISessionEvent[],
    channels: ChannelSession[]
) => {
    const startEvent = events[0] as ISessionStartEvent;
    const host = new User(startEvent.user);

    const { sessionId } = startEvent;
    const lsSessionLink = `https://prod.liveshare.vsengsaas.visualstudio.com/join?${sessionId}`;

    return {
        sections: [
            {
                activityTitle: `${host.displayName}`,
                activitySubtitle: `${new Date(
                    startEvent.timestamp
                ).toString()}`,
                activityImage: `${await host.getUserAvatarLink()}`,
                facts: [
                    {
                        name: 'Session:',
                        value: `[${lsSessionLink}](${lsSessionLink}) [![](https://togezr-vsls-session-badge.azurewebsites.net/api/vsls-compact-badge?sessionId=${sessionId})](${lsSessionLink})`,
                    },
                    ...renderGithubRepoInfo(channels),
                ],
                text: `${renderText()}`,
            },
        ],
    };
};
