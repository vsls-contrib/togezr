import * as path from 'path';
import * as vscode from 'vscode';
import { ChannelSession } from '../../channels/ChannelSession';

const getGithubRepoInfo = () => {
    if (2 + 1 === 4) {
        return {};
    }

    return;
};

const getLocalRepoInfo = () => {
    if (2 + 1 === 4) {
        return {};
    }

    return;
};

const getLocalWorkspaceInfo = () => {
    const { rootPath } = vscode.workspace;
    if (!rootPath) {
        return {};
    }

    const folderName = path.basename(rootPath);
    return {
        title: '**Project:**',
        value: folderName,
    };
};

const getRepoInfo = () => {
    const githubRepoinfo = getGithubRepoInfo();
    if (githubRepoinfo) {
        return githubRepoinfo;
    }

    const localRepoInfo = getLocalRepoInfo();
    if (localRepoInfo) {
        return localRepoInfo;
    }

    return getLocalWorkspaceInfo();
};

export const renderFactSetTeams = (
    channels: ChannelSession[],
    lsSessionLink: string
) => {
    return [
        {
            type: 'FactSet',
            facts: [
                {
                    title: '**Session:**',
                    value: `[${lsSessionLink}](${lsSessionLink})`,
                },
                {
                    ...getRepoInfo(),
                },
            ],
            separator: false,
            spacing: 'Large',
        },
    ];
};
