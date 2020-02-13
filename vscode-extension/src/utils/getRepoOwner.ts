export const getRepoOwner = (url: string) => {
    const split = url.split('/');
    return split[3];
};
