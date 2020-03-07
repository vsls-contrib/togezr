import { IIssueTogezrFooter } from "./interfaces/IIssueTogezrFooter";
import { trace } from "../trace";

const hashString = (str: string) => {
    if (!str) {
        return `0`;
    }
    let hash = 0, i, chr;

    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    
    return `${hash}`;
}

export const createIssueRecord = (issueDetails: IIssueTogezrFooter) => {
    const { badge, users, branch, issue } = issueDetails;

    const result = `${hashString(badge)}_${hashString(users)}_${hashString(branch)}_${issue.state}`;

    trace.info(`create issue record: #${issue.number}, ${result}`)
    
    return result;
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