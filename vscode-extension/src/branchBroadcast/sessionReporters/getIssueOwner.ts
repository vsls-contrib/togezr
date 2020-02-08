export const getIssueOwner = (url: string) => {
    const split = url.split('/');
    return split[3];
};
