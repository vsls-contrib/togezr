import { ChannelSession } from '../../channels/ChannelSession';
import { GitHubChannelSession } from '../../channels/GitHubChannelSession';
import { TSlackChannel } from '../../interfaces/TSlackChannel';
import { ISessionEvent } from '../../sessionConnectors/renderer/events';
import { renderGithubIssueDetails } from './renderGithubIssueDetails';
import { renderFooter } from './renderSlackFooter';
import { renderGuests } from './renderSlackGuests';
import { renderHostHeader } from './renderSlackHeader';

export const renderSlackComment = async (
    events: ISessionEvent[],
    channel: TSlackChannel,
    siblingChannels: ChannelSession[]
): Promise<any[]> => {
    const blocks = [...renderHostHeader(events)];

    const githubIssueChannel = siblingChannels.find((ch) => {
        return ch.channel.type === 'github-issue';
    });

    const githubIssueDetails = await renderGithubIssueDetails(
        githubIssueChannel as GitHubChannelSession
    );

    blocks.push(...githubIssueDetails);

    const guests = await renderGuests(events);
    blocks.push(...guests);

    const footer = renderFooter(events);
    if (footer.length) {
        blocks.push(...footer);
    }

    return blocks.filter((block) => {
        return !!block;
    });
};
