export const getIssueId = (url: string) => {
    const split = url.split('/');
    return split[6];
};
