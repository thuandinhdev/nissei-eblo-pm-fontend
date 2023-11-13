export class Leave {
    id: number;
    user_id: number;
    leave_type_id: number;
    duration: string;
    duration_type: string;
    multi_date: string;
    leave_day: number;
    leave_date: Date;
    reason: string;
    reject_reason: string;
    status: number;
    attachments: any;
}
