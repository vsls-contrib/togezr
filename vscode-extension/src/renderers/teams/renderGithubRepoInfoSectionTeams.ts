import { ChannelSession } from '../../channels/ChannelSession';
export const renderGithubRepoInfoSectionTeams = (
    channels: ChannelSession[]
) => {
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
                    // id: '70b02d2c-7160-7191-80e3-660d16aa6502',
                    padding: 'None',
                    width: 'auto',
                    items: [
                        {
                            type: 'TextBlock',
                            // id: 'f7abdf1a-3cce-2159-28ef-f2f362ec937e',
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
