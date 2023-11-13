import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Task} from '../../shared/models/task.model';
import {Activities} from '../../shared/models/activities.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TaskService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    create(task: Task) {
        return this.http.post(`${this.apiUrl}/api/tasks`, task);
    }

    getAll() {
        return this.http.get<Task[]>(`${this.apiUrl}/api/tasks`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/tasks/${id}`);
    }

    update(task: Task) {
        return this.http.put(`${this.apiUrl}/api/tasks/${task.id}`, task);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/tasks/${id}`);
    }

    getTaskActivity(id: number) {
        return this.http.get<Activities[]>(`${this.apiUrl}/api/activities/Task/${id}`);
    }

    changeStatus(task: any) {
        return this.http.post(`${this.apiUrl}/api/tasks/${task.id}/change-status`, {'status': task.status});
    }

    changePriority(task: any) {
        return this.http.post(`${this.apiUrl}/api/tasks/${task.id}/change-priority`, {'priority': task.priority});
    }

    updateNotes(task: Task) {
        return this.http.put(`${this.apiUrl}/api/tasks/notes/${task.id}`, task);
    }

    getGeneratedId() {
        return this.http.get(`${this.apiUrl}/api/tasks/get-generated-id`);
    }

    getParentTask(id: number) {
        return this.http.get(`${this.apiUrl}/api/tasks/${id}/parent-task`, {});
    }

    getsubTaskCountByParent(id: number) {
        return this.http.get(`${this.apiUrl}/api/tasks/${id}/subtask-count-by-parent`, {});
    }

    getTaskForTaskBoard(params: any) {
        return this.http.post(`${this.apiUrl}/api/taskboard`, params);
    }

    updateStatusList(task: Task) {
        return this.http.post(`${this.apiUrl}/api/tasks/status-list`, task);
    }

    getTaskPermission(id, type) {
        return this.http.get(`${this.apiUrl}/api/tasks/${id}/permission/${type}`, {});
    }

    getCalendarTasks() {
        return this.http.get(`${this.apiUrl}/api/tasks/calendar`);
    }

    convertSprintTaskToTask(task: any) {
        return this.http.post(`${this.apiUrl}/api/tasks/convertsprinttask-to-task`, task);
    }
}
