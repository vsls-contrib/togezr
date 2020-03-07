import { IGithubIssueEvent } from './interfaces/IGithubIssueEvent';
import { GITHUB_ISSUE_TOGEZR_FOOTER_REGEX, GITHUB_ISSUE_FOOTER_SEPARATOR, GITHUB_ISSUE_FOOTER_POWERED_BY, GITHUB_ISSUE_TOGEZR_LABEL_NAME, GITHUB_ISSUE_TOGEZR_LABEL_DESCRIPTION, GITHUB_ISSUE_TOGEZR_LABEL_COLOR, TOGEZR_CONNECTED_BRANCHES_ISSUE_TITLE} from './constants';
import { issuesFooterRepository } from './issuesFooterRepository';
import { getFooterBranch } from './parser/getFooterBranch';
import { getFooterUsers } from './parser/getFooterUsers';
import { getFooterBadge } from './parser/getFooterBadge';
import { githubApp } from './app/githubApp';
import { IGithubIssue } from './interfaces/IGithubIssue';
import { IIssueTogezrFooter } from './interfaces/IIssueTogezrFooter';

const getIssueTogezrFooter = (issue: IGithubIssue): IIssueTogezrFooter | null=> {
    const { body } = issue;
    if (!body) {
        return  null;
    }

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

const renderRepoWideIssue = (issues: IGithubIssue[]): string | null => {
    const issueDetails = issues
        .filter((issue) => {
            return !issue.title.startsWith(TOGEZR_CONNECTED_BRANCHES_ISSUE_TITLE);
        })
        .filter((issue) => {
            return issue.state === 'open';
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
        });

    if (!issueDetails.length) {
        return null;
    }

    const issueFooters = issueDetails.map((issue) => {
        return renderRepoWideIssueDetail(issue);
    });

    const isChangedDescriptions = issueDetails.map((issueDetail) => {
        return issuesFooterRepository.isIssueFooterChanged(issueDetail);
    });

    const isNothingChanged = (isChangedDescriptions.indexOf(true) === -1);
    if (isNothingChanged) {
        return;
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
    const { repository } = issueUpdateEvent;

    const { id } = issueUpdateEvent.installation;
    const token = await githubApp.getToken(id);

    const { owner, name } = repository;

    const issues: IGithubIssue[] = await githubApp.rest(token).paginate(`GET /repos/${owner.login}/${name}/issues?state=all&labels=togezr`);

    const sessionsIssue = issues.find((issue) => {
        return issue.title.startsWith(TOGEZR_CONNECTED_BRANCHES_ISSUE_TITLE) ;
    });

    const repoWideDetails = renderRepoWideIssue(issues);
    const togezrLabel = {
        name: GITHUB_ISSUE_TOGEZR_LABEL_NAME,
        color: GITHUB_ISSUE_TOGEZR_LABEL_COLOR,
        description: GITHUB_ISSUE_TOGEZR_LABEL_DESCRIPTION
    };

    if (!sessionsIssue) {
        await githubApp.rest(token).issues.create({
            owner: owner.login,
            repo: name,
            title: TOGEZR_CONNECTED_BRANCHES_ISSUE_TITLE,
            body: repoWideDetails,
            labels: [togezrLabel]
        });

        return;
    }

    // if session issue closed(disabled), no-op
    if (sessionsIssue.state === 'closed') {
        return;
    }

    /**
     * Update the issue.
     */
    const existingTogezrLabel = sessionsIssue.labels.find((label) => {
        return label.name === GITHUB_ISSUE_TOGEZR_LABEL_NAME;
    });

    const labels = existingTogezrLabel
        ? undefined
        : [...sessionsIssue.labels, togezrLabel]

    await githubApp.rest(token).issues.update({
        owner: owner.login,
        repo: name,
        issue_number: sessionsIssue.number,
        body: repoWideDetails,
        labels
    });
};
