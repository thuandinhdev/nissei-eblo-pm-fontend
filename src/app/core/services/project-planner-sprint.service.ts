import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ProjectPlanner} from '../../shared/models/project-planner.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ProjectPlannerSprintService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll(params: any) {
        return this.http.post(`${this.apiUrl}/api/projects/projectsprinttasks`, params);
    }

    create(projectPlanner: ProjectPlanner) {
        return this.http.post(`${this.apiUrl}/api/projectplannersprint`, projectPlanner);
    }

    createTask(projectPlanner: ProjectPlanner) {
        return this.http.post(`${this.apiUrl}/api/projectsprinttask`, projectPlanner);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/projectplannersprint/${id}`);
    }

    deleteTask(id: number) {
        return this.http.delete(`${this.apiUrl}/api/projectsprinttask/${id}`);
    }

    update(projectPlanner: ProjectPlanner) {
        return this.http.put(`${this.apiUrl}/api/projectplannersprint/${projectPlanner.id}`, projectPlanner);
    }

    updateTask(projectPlanner: ProjectPlanner) {
        return this.http.put(`${this.apiUrl}/api/projectsprinttask/${projectPlanner.id}`, projectPlanner);
    }

    getProjectSprintById(id: number) {
        return this.http.get<ProjectPlanner[]>(`${this.apiUrl}/api/projectplannersprint/${id}`);
    }

    getSprintTaskById(id: number) {
        return this.http.get<ProjectPlanner[]>(`${this.apiUrl}/api/projectsprinttask/${id}`);
    }

    moveTask(projectPlanner: ProjectPlanner) {
        return this.http.put(`${this.apiUrl}/api/projectsprinttask/move/${projectPlanner.task_id}`, projectPlanner);
    }

    getSprintByProject(id: number) {
        return this.http.get(`${this.apiUrl}/api/projectplannersprint/sprintbyproject/${id}`);
    }
}
