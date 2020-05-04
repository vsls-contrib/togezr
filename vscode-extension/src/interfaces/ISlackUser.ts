export interface ISlackUserProfile {
    title: string;
    phone: string;
    skype: string;
    last_name: string;
    real_name: string;
    real_name_normalized: string;
    status_emoji: string;
    status_expiration: number;
    status_text: string;
    status_text_canonical: string;
    team: string;
    always_active: boolean;
}

export interface ISlackUser {
    id: string;
    team_id: string;
    name: string;
    real_name: string;
    profile: ISlackUserProfile;
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
