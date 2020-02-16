interface ISlackChannelTopic {
    value: string;
    creator: string;
    last_set: number;
}

interface ISlackChannelPurpose {
    value: string;
    creator: string;
    last_set: number;
}

export interface ISlackChannel {
    id: string;
    is_member: boolean;
    name: string;
    topic: ISlackChannelTopic;
    purpose: ISlackChannelPurpose;
    num_members: number;
    //     "id": "CT29MGU2D",
    //     "name": "liveshare-integration",
    //     "is_channel": true,
    //     "created": 1580450284,
    //     "is_archived": false,
    //     "is_general": false,
    //     "unlinked": 0,
    //     "creator": "UTEAFJ0KH",
    //     "name_normalized": "liveshare-integration",
    //     "is_shared": false,
    //     "is_org_shared": false,
    //     "is_member": false,
    //     "is_private": false,
    //     "is_mpim": false,
    //     "members": [
    //         "UTEAFJ0KH"
    //     ],
    //     "topic": {
    //         "value": "",
    //         "creator": "",
    //         "last_set": 0
    //     },
    //     "purpose": {
    //         "value": "",
    //         "creator": "",
    //         "last_set": 0
    //     },
    //     "previous_names": [],
    //     "num_members": 1
    // },
}
