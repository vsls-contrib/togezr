export interface ISlackUserGroup {
    id: string;
    team_id: string;
    name: string;
    real_name: string;
    color: string;
    deleted: boolean;
    has_2fa: boolean;
    is_admin: boolean;
    is_app_user: boolean;
    is_bot: boolean;
    is_owner: boolean;
    is_primary_owner: boolean;
    is_restricted: boolean;
    is_ultra_restricted: boolean;
    tz: string;
    tz_label: string;
    tz_offset: number;
    updated: number;
}
