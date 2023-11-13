export class Activities {
    id: number;
    description: string;
    module: string;
    module_field_id: number;
    diff_for_humans: string;
    updated_at: string;
    user: {
        id: number
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        avatar: string;
    };
    user_id: number;
}
