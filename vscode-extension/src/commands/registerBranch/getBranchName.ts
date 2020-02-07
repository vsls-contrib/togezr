import { getUserName } from '../../branchBroadcast/git';
import { randomInt } from '../../branchBroadcast/utils/randomInt';
import { Branch } from '../../typings/git';

export const getBranchName = (branch: Branch): [string, [number, number]] => {
    const { name } = branch;
    const setName = name!;
    const cleanBranchName = setName.trim().toLowerCase();
    if (cleanBranchName !== 'master') {
        return [setName, [0, 0]];
    }
    const gitUsername = getUserName() || '';
    if (!gitUsername) {
        return ['', [0, 0]];
    }
    const cleanUserName = gitUsername
        .trim()
        .toLowerCase()
        .replace(/\s/, '-');
    return [
        `${cleanUserName}/feature-${randomInt()}`,
        [gitUsername.length + 1, 90],
    ];
};
