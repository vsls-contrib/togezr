import { TGitHubChannel } from '../../interfaces/TGitHubChannel';
import { ISessionEvent } from '../../sessionConnectors/renderer/events';
import { githubCommentRenderer } from '../../sessionConnectors/renderer/githubCommentRenderer';

export const renderGitHubComment = async (
    events: ISessionEvent[],
    channel: TGitHubChannel
): Promise<string> => {
    return githubCommentRenderer.render(events);
};
