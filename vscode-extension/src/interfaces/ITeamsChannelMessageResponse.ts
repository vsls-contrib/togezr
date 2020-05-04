interface ITeamsChannelMessageResponse {
    '@odata.context': string;
    createdDateTime: string;
    deletedDateTime: null;
    etag: string;
    from: {
        application: null;
        device: null;
        conversation: null;
    };
    id: string;
    importance: string;
    lastModifiedDateTime: string | null;
    locale: string;
    messageType: string;
    policyViolation: null;
    mentions: [];
    reactions: [];
    replyToId: null;
    subject: null;
    summary: null;
}
