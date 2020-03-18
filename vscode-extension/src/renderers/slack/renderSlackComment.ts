import { TSlackChannel } from '../../interfaces/TSlackChannel';
import { ISessionEvent } from '../../sessionConnectors/renderer/events';
import { renderFooter } from './renderSlackFooter';
import { renderGuests } from './renderSlackGuests';
import { renderHostHeader } from './renderSlackHeader';

export const renderSlackComment = async (
    events: ISessionEvent[],
    channel: TSlackChannel
): Promise<any[]> => {
    const blocks = [...renderHostHeader(events)];

    // TODO: read from the GitHub channel if possible
    // { type: 'divider' },
    // // blocks.push(
    // //     await renderGithubIssueDetails(this.registyData, this.githubConnector)
    // // );

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
