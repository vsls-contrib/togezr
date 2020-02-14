import { IRegistryData } from '../commands/registerBranch/branchRegistry';
import { renderLiveShareCompactBadge } from './renderer/renderLiveShareCompactBadge';

export const getIssueDetailsLiveShare = (data: IRegistryData) => {
    const { sessionId } = data;

    return `**Live Share:** ${renderLiveShareCompactBadge(sessionId!)}`;
};
