import * as path from 'path';
import * as vscode from 'vscode';
import { GitHubChannelSession } from '../../channels/GitHubChannelSession';
import { githubAvatarRepository } from '../../sessionConnectors/github/githubAvatarsRepository';
import { cleanupGithubIssueDescription } from '../../utils/cleanupGithubIssueDescription';
import { getLocalRepoInfo } from './getLocalRepoInfo';
import { SLACK_DIVIDER } from './slackDivider';

export interface IRepoInfo {
    repoName: string;
    description?: string;
    branchName?: string;
}

const getLocalWorkspaceInfo = (): IRepoInfo | undefined => {
    const { rootPath } = vscode.workspace;
    if (!rootPath) {
        return;
    }
    const repoName = path.basename(rootPath);
    return {
        repoName,
    };
};
const renderRepoInfoDetails = (repoInfo: IRepoInfo) => {
    const branchSuffix = repoInfo.branchName
        ? ` \n Branch: ${repoInfo.branchName}`
        : '';

    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `Project: ${repoInfo.repoName}${branchSuffix}`,
            },
        },
        SLACK_DIVIDER,
    ];
};

export const renderGithubIssueDetails = async (
    githubIssueChannel: GitHubChannelSession | undefined
) => {
    if (!githubIssueChannel) {
        const localRepoInfo = getLocalRepoInfo();
        if (localRepoInfo) {
            return renderRepoInfoDetails(localRepoInfo);
        }

        const localWorkspaceInfo = getLocalWorkspaceInfo();
        if (localWorkspaceInfo) {
            return renderRepoInfoDetails(localWorkspaceInfo);
        }

        return [];
    }

    const { issue } = githubIssueChannel.channel;
    const cleanIssueBody = cleanupGithubIssueDescription(issue.body, 500);
    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `[<${issue.html_url}|#${issue.number}>] ${issue.title}*\\n\\n${cleanIssueBody}`,
            },
            accessory: {
                type: 'image',
                image_url: `${await githubAvatarRepository.getAvatarFor(
                    issue.user.login
                )}`,
                alt_text: 'plants',
            },
        },
        SLACK_DIVIDER,
    ];
};
