import { IGithubIssueEvent } from './interfaces/IGithubIssueEvent';
import { GITHUB_ISSUE_TOGEZR_FOOTER_REGEX, GITHUB_ISSUE_FOOTER_SEPARATOR, GITHUB_ISSUE_FOOTER_POWERED_BY} from './constants';
import { issuesFooterRepository } from './issuesFooterRepository';
import { getFooterBranch } from './parser/getFooterBranch';
import { getFooterUsers } from './parser/getFooterUsers';
import { getFooterBadge } from './parser/getFooterBadge';
import { githubApp } from './app/githubApp';
import { IGithubIssue } from './interfaces/IGithubIssue';

interface IIssueTogezrFooter {
    badge: string;
    users?: string;
    branch: string;
    issue: IGithubIssue;
}

const getIssueTogezrFooter = (issue: IGithubIssue): IIssueTogezrFooter | null=> {
    const { body } = issue;
    const footerMatch = body.match(GITHUB_ISSUE_TOGEZR_FOOTER_REGEX);
    if (!footerMatch) {
        return null;
    }

    const footer = footerMatch[0];
    if (!footer) {
        return null;
    }
    
    const badge = getFooterBadge(footer);
    const users = getFooterUsers(footer);
    const branch = getFooterBranch(footer);

    if (!badge || !users || !branch) {
        return null;
    }

    return {
        badge,
        users,
        branch,
        issue
    };
}

const renderRepoWideIssueDetail = (issueData: IIssueTogezrFooter) => {
    const { badge, branch, users, issue } = issueData;

    const header = `${badge} ${branch}`
    const details = `**[#${issue.number}] ${issue.title}**`;
    const cleanUsers = users
        ? `${users}`
        : '';

    return `${header}\n${details}\n\n${cleanUsers}`;
}

const TOGEZR_CONNECTED_BRANCHES_ISSUE_TITLE = '[Togezr]: Connected branches';

const renderRepoWideIssue = (issues: IGithubIssue[]): string | null => {
    const issueFooters = issues
        .filter((issue) => {
            return !issue.title.startsWith(TOGEZR_CONNECTED_BRANCHES_ISSUE_TITLE);
        })
        .map((issue) => {
            return getIssueTogezrFooter(issue);
        })
        .filter((issue) => {
            return !!issue;
        })
        .sort((issue1, issue2) => {
            if (!issue1.users || !issue2.users) {
                return 0;
            }

            return issue2.users.length - issue1.users.length;
        })
        .map((issue) => {
            return renderRepoWideIssueDetail(issue);
        });

    if (!issueFooters.length) {
        return null;
    }

    const details = issueFooters.join(`\n${GITHUB_ISSUE_FOOTER_SEPARATOR}`);
    const header = `**${issueFooters.length} Connected branches:**\n${GITHUB_ISSUE_FOOTER_SEPARATOR}`;

    return [
        header,
        `${details}\n${GITHUB_ISSUE_FOOTER_SEPARATOR}`,
        ,
        GITHUB_ISSUE_FOOTER_POWERED_BY
    ].join('\n');
}

export const handleIssueUpdate = async (issueUpdateEvent: IGithubIssueEvent) => {
    const { issue, repository } = issueUpdateEvent;
    const { body } = issue;

    // const isChanged = issuesFooterRepository.isIssueFooterChanged(issue.html_url, badgeString, usersString, branchString);

    const { id } = issueUpdateEvent.installation;
    const token = await githubApp.getToken(id);

    const { owner, name } = repository;

    const issues: IGithubIssue[] = await githubApp.rest(token).paginate(`GET /repos/${owner.login}/${name}/issues`);

    const repoWideDetails = renderRepoWideIssue(issues);

    console.log(repoWideDetails);

    // return isChanged;
    // const isConnected = isIssueConnected(body);
    // console.log(isConnected, body);
};
