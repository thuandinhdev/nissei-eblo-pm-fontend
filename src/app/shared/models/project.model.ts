export class Project {
    id: number;
    client_id: number;
    project_name: string;
    project_version: string;
    progress: number;
    project_hours: boolean;
    start_date: Date;
    end_date: Date;
    billing_type: number;
    price_rate: number;
    estimated_hours: string;
    status: number;
    demo_url: string;
    description: string;
    project_logo: string;
    assigned_group_id: number;
    assign_to: string;
    notes: string;
}
