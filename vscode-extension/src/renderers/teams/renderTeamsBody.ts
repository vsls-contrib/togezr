import { ChannelSession } from '../../channels/ChannelSession';
import { IGitHubRepoIssueChannel } from '../../interfaces/IGitHubRepoIssueChannel';
import { DEFAULT_GITHUB_AVATAR } from '../../sessionConnectors/constants';
import { githubAvatarRepository } from '../../sessionConnectors/github/githubAvatarsRepository';
import {
    ISessionEvent,
    ISessionStartEvent,
    ISessionUserJoinEvent,
} from '../../sessionConnectors/renderer/events';
import { User } from '../../user';
import { getUserEvents } from '../../utils/getUserEvents';

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

export const renderGithubRepoInfoTeams = (channels: ChannelSession[]) => {
    /**
     * TODO: implement rendering of GH Issue details
     */

    // return [];

    return [
        {
            type: 'TextBlock',
            // id: '44906797-222f-9fe2-0b7a-e3ee21c6e380',
            text: '[[#83]]() Calls are getting dropped unexpectedly',
            wrap: true,
            weight: 'Bolder',
            size: 'Large',
        },
        {
            type: 'ColumnSet',
            columns: [
                {
                    type: 'Column',
                    // id: '698aaf11-6d31-8a38-19ae-9f567b5778b9',
                    padding: 'None',
                    width: '80px',
                    items: [
                        {
                            type: 'Image',
                            // id: '043e9dfb-279e-db2a-30a8-a7e162c3d857',
                            url:
                                'https://avatars1.githubusercontent.com/u/1478800?u=433c0a67c594403cfcc712fd1508d6895dee6c5d&v=4',
                            spacing: 'None',
                            size: 'Large',
                        },
                    ],
                },
                {
                    type: 'Column',
                    id: '70b02d2c-7160-7191-80e3-660d16aa6502',
                    padding: 'None',
                    width: 'auto',
                    items: [
                        {
                            type: 'TextBlock',
                            id: 'f7abdf1a-3cce-2159-28ef-f2f362ec937e',
                            text:
                                'We have this ongoing issue for the last one week. Outgoing calls from our account sometime get dropped unexpectedly. We need a quick resolution! We have this ongoing issue for the last one week. Outgoing calls from our account sometime get dropped unexpectedly. We need a quick resolution!',
                            wrap: true,
                        },
                    ],
                },
            ],
            padding: 'None',
        },
    ];
};

const renderFactSet = (channels: ChannelSession[], lsSessionLink: string) => {
    return [
        {
            type: 'FactSet',
            id: '452a52da-4305-219b-2097-a0512f36caa1',
            facts: [
                {
                    title: '**Session:**',
                    value: `[${lsSessionLink}](${lsSessionLink})`,
                },
                {
                    title: '**Repo:**',
                    value: '[liveshare-teams]() [[⎇oleg-solomka/feature-1]()]',
                },
            ],
            separator: false,
            spacing: 'Large',
        },
    ];
};

const renderUser = async (
    event: ISessionStartEvent | ISessionUserJoinEvent
) => {
    const imageUrl = event.user.userName
        ? await githubAvatarRepository.getAvatarFor(event.user.userName)
        : DEFAULT_GITHUB_AVATAR;

    return {
        type: 'Column',
        padding: 'None',
        width: 'auto',
        items: [
            {
                type: 'Image',
                url: imageUrl,
                size: 'Small',
                spacing: 'None',
            },
        ],
    };
};

const renderUsers = async (events: ISessionEvent[]) => {
    const guests = getUserEvents(events);
    const clampedGuests = guests.slice(0, 4);

    const renderedGuestsPromises: any[] = clampedGuests.map(async (guest) => {
        return await renderUser(guest);
    });
    const renderedGuests = await Promise.all(renderedGuestsPromises);

    const suffix = guests.length === 1 ? '' : 's';
    const guestText = `${guests.length} guest${suffix}`;

    renderedGuests.push({
        type: 'Column',
        padding: 'None',
        width: 'stretch',
        items: [
            {
                type: 'TextBlock',
                text: guestText,
                wrap: true,
                weight: 'Bolder',
                horizontalAlignment: 'Left',
                spacing: 'None',
            },
        ],
        verticalContentAlignment: 'Center',
    });

    return renderedGuests;
};

const renderCardFooter = async (
    events: ISessionEvent[],
    channels: ChannelSession[],
    lsSessionLink: string
) => {
    return {
        type: 'ColumnSet',
        columns: [
            {
                type: 'Column',
                padding: 'None',
                width: 'stretch',
                horizontalAlignment: 'Right',
                items: [
                    {
                        type: 'ColumnSet',
                        columns: [...(await renderUsers(events))],
                        padding: 'None',
                        spacing: 'Small',
                    },
                ],
                verticalContentAlignment: 'Center',
            },
            {
                type: 'Column',
                padding: 'None',
                width: 'auto',
                items: [
                    {
                        type: 'ActionSet',
                        actions: [
                            {
                                type: 'Action.OpenUrl',
                                title: '◉ Join Session',
                                url: lsSessionLink,
                                style: 'positive',
                                isPrimary: true,
                            },
                        ],
                        horizontalAlignment: 'Center',
                    },
                ],
                horizontalAlignment: 'Left',
                verticalContentAlignment: 'Center',
            },
        ],
        padding: 'Default',
        style: 'emphasis',
    };
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
        body: [
            {
                type: 'Container',
                padding: 'None',
                spacing: 'None',
                items: [
                    {
                        type: 'Container',
                        padding: 'Medium',
                        items: [
                            {
                                type: 'ColumnSet',
                                columns: [
                                    {
                                        type: 'Column',
                                        padding: 'None',
                                        width: 'stretch',
                                        horizontalAlignment: 'Right',
                                        items: [
                                            {
                                                type: 'ColumnSet',
                                                columns: [
                                                    {
                                                        type: 'Column',
                                                        padding: 'None',
                                                        width: 'auto',
                                                        items: [
                                                            {
                                                                type:
                                                                    'TextBlock',
                                                                text: `${host.displayName} started [Live Share session](${lsSessionLink}).`,
                                                                wrap: true,
                                                                spacing: 'None',
                                                            },
                                                        ],
                                                    },
                                                ],
                                                padding: 'None',
                                            },
                                        ],
                                        verticalContentAlignment: 'Center',
                                    },
                                ],
                                padding: 'None',
                            },
                            ...renderGithubRepoInfoTeams(channels),
                            ...renderFactSet(channels, lsSessionLink),
                        ],
                    },
                    {
                        ...(await renderCardFooter(
                            events,
                            channels,
                            lsSessionLink
                        )),
                    },
                ],
            },
        ],
    };
};
