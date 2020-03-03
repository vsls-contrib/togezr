import { IIssueTogezrFooter } from "./interfaces/IIssueTogezrFooter";

export const createIssueRecord = (issueDetails: IIssueTogezrFooter) => {
    const { badge, users, branch } = issueDetails;
    
    return `${badge}_${users}_${branch}`;
}

export class IssuesFooterRepository {
    private lastUpdatedFooterIssuesMap = new Map<string, string>();

    public isIssueFooterChanged = (issueDetails: IIssueTogezrFooter): boolean => {
        const { issue } = issueDetails;
        const record = this.lastUpdatedFooterIssuesMap.get(issue.id);
        const issueRecord = createIssueRecord(issueDetails);

        if (!record) {
            this.lastUpdatedFooterIssuesMap.set(issue.id, issueRecord);
            return true;
        }

        const isEqual = (record === issueRecord);
        if (!isEqual) {
            this.lastUpdatedFooterIssuesMap.set(issue.id, issueRecord);
            return true;
        }

        return false;
    }
}

export const issuesFooterRepository = new IssuesFooterRepository();