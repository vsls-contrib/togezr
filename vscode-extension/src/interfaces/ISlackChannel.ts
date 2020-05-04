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
    name: string;
    name_normalized: string;
    topic: ISlackChannelTopic;
    purpose: ISlackChannelPurpose;
    num_members: number;
    created: number;
    creator: string;
    is_member: boolean;
    is_archived: boolean;
    is_channel: boolean;
    is_general: boolean;
    is_mpim: boolean;
    is_org_shared: boolean;
    is_private: boolean;
    is_shared: boolean;
    members: string[];
    unlinked: number;
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
