export interface ISlackIM {
    created: number;
    id: string;
    is_archived: boolean;
    is_im: boolean;
    is_org_shared: boolean;
    is_user_deleted: boolean;
    priority: number;
    user: string;
}
