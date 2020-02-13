export const getRepoName = (url: string) => {
    const split = url.split('/');
    return split[4];
};
