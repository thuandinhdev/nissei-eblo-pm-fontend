import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Project} from '../../shared/models/project.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ProjectService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Project[]>(`${this.apiUrl}/api/projects`);
    }

    getMyProjects() {
        return this.http.get<Project[]>(`${this.apiUrl}/api/projects/my`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/projects/${id}`);
    }

    getProjectById(id: number) {
        return this.http.get(`${this.apiUrl}/api/projects/getbyid/${id}`);
    }

    create(project: Project) {
        return this.http.post(`${this.apiUrl}/api/projects`, project);
    }

    update(project: Project) {
        return this.http.put(`${this.apiUrl}/api/projects/${project.id}`, project);
    }

    delete(id: number, params: any) {
        return this.http.post(`${this.apiUrl}/api/projects/delete/${id}`, params);
    }

    updateNotes(project: Project) {
        return this.http.put(`${this.apiUrl}/api/projects/notes/${project.id}`, project);
    }

    changeStatus(project: any) {
        return this.http.post(`${this.apiUrl}/api/projects/${project.ids}/change-status`, {'status': project.status});
    }

    getReleasePlanner() {
        return this.http.get(`${this.apiUrl}/api/projects/release-planner`);
    }

    getProject() {
        return this.http.get(`${this.apiUrl}/api/projects/projectmembers`, {});
    }

    getProjectPermission(id) {
        return this.http.get(`${this.apiUrl}/api/projects/${id}/permission`, {});
    }
}
