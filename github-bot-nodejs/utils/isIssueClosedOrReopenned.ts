export const isIssueClosedOrReopenned = (body: any) => {
    const isClosed = (body.action === 'closed');
    const isReopened = (body.action === 'reopened');
    return (isClosed || isReopened) && body.issue;
};
