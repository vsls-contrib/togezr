import { ChannelSession } from '../../channels/ChannelSession';
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
                    title: '**Repo:**',
                    value: '[liveshare-teams]() [[⎇oleg-solomka/feature-1]()]',
                },
            ],
            separator: false,
            spacing: 'Large',
        },
    ];
};
