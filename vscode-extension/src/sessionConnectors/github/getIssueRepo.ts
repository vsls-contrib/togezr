export const getIssueRepo = (url: string) => {
    const split = url.split('/');
    return split[4];
};
