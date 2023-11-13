import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Incident} from '../../shared/models/incident.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class IncidentService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Incident[]>(`${this.apiUrl}/api/incident`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/incident/${id}`);
    }

    create(incident: Incident) {
        return this.http.post(`${this.apiUrl}/api/incident`, incident);
    }

    update(incident: Incident) {
        return this.http.put(`${this.apiUrl}/api/incident/${incident.id}`, incident);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/incident/${id}`);
    }

    updateNotes(incident: Incident) {
        return this.http.put(`${this.apiUrl}/api/incident/notes/${incident.id}`, incident);
    }

    changeStatus(incident: any) {
        return this.http.post(`${this.apiUrl}/api/incident/${incident.id}/change-status`, {'status': incident.status});
    }

    changeSeverity(incident: any) {
        return this.http.post(`${this.apiUrl}/api/incident/${incident.id}/change-severity`, {'priority': incident.priority});
    }

    getIncidentGeneratedId() {
        return this.http.get(`${this.apiUrl}/api/incident/get-generated-id`);
    }

    getIncidentPermission(id, type) {
        return this.http.get(`${this.apiUrl}/api/incident/${id}/permission/${type}`, {});
    }

    getIncidentForKanban(incident: any) {
        return this.http.post(`${this.apiUrl}/api/incident/kanban`, incident);
    }

    updateKanbanStatusList(incident: any) {
        return this.http.post(`${this.apiUrl}/api/incident/update-kanban`, incident);
    }

    getIncidentForCalendar(obj = {}) {
        return this.http.post(`${this.apiUrl}/api/incident/calendar`, obj);
    }

}
