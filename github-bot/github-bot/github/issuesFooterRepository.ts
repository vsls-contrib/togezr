export const createIssueRecord = (badgeString: string, usersString: string, branchString: string) => {
    return `${badgeString}_${usersString}_${branchString}`;
}

export class IssuesFooterRepository {
    private lastUpdatedFooterIssuesMap = new Map<string, string>();

    public isIssueFooterChanged = (issueId: string, badgeString: string, usersString: string, branchString: string): boolean => {
        const record = this.lastUpdatedFooterIssuesMap.get(issueId);
        const issueRecord = createIssueRecord(badgeString, usersString, branchString);

        if (!record) {
            this.lastUpdatedFooterIssuesMap.set(issueId, issueRecord);
            return true;
        }

        const isEqual = (record === issueRecord);
        if (!isEqual) {
            this.lastUpdatedFooterIssuesMap.set(issueId, issueRecord);
            return true;
        }

        return false;
    }
}

export const issuesFooterRepository = new IssuesFooterRepository();