import { GitHubAccountRepoIssueTreeItem } from '../../../activityBar/github/GitHubAccountRepoIssueTreeItem';
import { lsApi, startLSSession } from '../../../branchBroadcast/liveshare';
import { GitHubChannelSession } from '../../../channels/GitHubChannelSession';
import { getGitHubChannelFromTreeItem } from './getGitHubChannelFromTreeItem';

export const shareIntoGitHubIssueChannel = async (
    item: GitHubAccountRepoIssueTreeItem,
    isReadOnlySession: boolean
) => {
    const gitHubChannel = getGitHubChannelFromTreeItem(item);
    const lsAPI = lsApi();
    const session = new GitHubChannelSession(gitHubChannel, [], lsAPI);
    await startLSSession(isReadOnlySession, session.sessionId);
    await session.init();
};
