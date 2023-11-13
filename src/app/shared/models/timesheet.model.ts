export class Timesheet {
    id: number;
    project_id: number;
    module_id: number;
    module_related_id: number;
    start_time: Date;
    end_time: Date;
    decimal_time: number;
    hour_time: string;
    note: string;
    created_user_id: number;
}
