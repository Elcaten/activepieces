export interface GetGroupsResponse {
    groups: GroupsItem[];
}
interface GroupsItem {
    id: number;
    name: string;
    group_type: string;
    updated_at: string;
    simplify_by_default: boolean;
    members: MembersItem[];
    original_debts: OriginalDebtsItem[];
    simplified_debts: SimplifiedDebtsItem[];
    avatar: Avatar;
    custom_avatar: boolean;
    cover_photo: Cover_photo;
    invite_link: string;
}
interface MembersItem {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    registration_status: string;
    picture: Picture;
    balance: BalanceItem[];
}
interface Picture {
    small: string;
    medium: string;
    large: string;
}
interface BalanceItem {
    currency_code: string;
    amount: string;
}
interface OriginalDebtsItem {
    from: number;
    to: number;
    amount: string;
    currency_code: string;
}
interface SimplifiedDebtsItem {
    from: number;
    to: number;
    amount: string;
    currency_code: string;
}
interface Avatar {
    original: null;
    xxlarge: string;
    xlarge: string;
    large: string;
    medium: string;
    small: string;
}
interface Cover_photo {
    xxlarge: string;
    xlarge: string;
}
