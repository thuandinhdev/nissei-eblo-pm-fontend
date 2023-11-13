export class Task {
    id: number;
    name: string;
    project_id: number;
    project_version: string;
    planned_start_date: string;
    planned_end_date: string;
    task_start_date: string;
    task_end_date: string;
    assign_to: string;
    status: number;
    priority: number;
    estimated_hours: number;
    progress: number;
    description: string;
    notes: string;
}
