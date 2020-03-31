// import { renderFooter } from './renderSlackFooter';
// import { renderGuests } from './renderSlackGuests';
// import { renderHostHeader } from './renderSlackHeader';
import { ChannelSession } from '../../channels/ChannelSession';
import { TTeamsChannel } from '../../interfaces/TTeamsChannel';
import { ISessionEvent } from '../../sessionConnectors/renderer/events';
import { renderTeamsBody } from './renderTeamsBody';
import { renderTeamsFooter } from './renderTeamsFooter';
import { renderTeamsHeader } from './renderTeamsHeader';

export const renderTeamsComment = async (
    events: ISessionEvent[],
    channel: TTeamsChannel,
    channels: ChannelSession[]
): Promise<{ [key: string]: any }> => {
    const header = await renderTeamsHeader(events);
    const body = await renderTeamsBody(events, channels);
    const footer = await renderTeamsFooter(events, channels);

    return {
        ...header,
        ...body,
        ...footer,
    };

    // const blocks = [...renderHostHeader(events)];
    // TODO: read from the GitHub channel if possible
    // { type: 'divider' },
    // // blocks.push(
    // //     await renderGithubIssueDetails(this.registyData, this.githubConnector)
    // // );
    // const guests = await renderGuests(events);
    // blocks.push(...guests);
    // const footer = renderFooter(events);
    // if (footer.length) {
    //     blocks.push(...footer);
    // }
    // return blocks.filter((block) => {
    //     return !!block;
    // });
};
