import { IRegistryData } from '../../commands/registerBranch/branchRegistry';
import { renderLiveShareCompactBadge } from '../renderer/renderLiveShareCompactBadge';

export const getIssueDetailsLiveShare = (data: IRegistryData) => {
    const { sessionId } = data;

    if (!sessionId) {
        return '##### The issue is connected to the feature branch:';
    }

    return `**Live Share:** ${renderLiveShareCompactBadge(sessionId!)}`;
};
