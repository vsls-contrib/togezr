export const getCleanCommitMessage = (commitMessage: string) => {
    const split = commitMessage.split(/Co\-authored\-by\:\s+.+\s+\<.+.\>/gim);
    const result = split[0];
    return result.replace(/\n/gim, ' ');
};
