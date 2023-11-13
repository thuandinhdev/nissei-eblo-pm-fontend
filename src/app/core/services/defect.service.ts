import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Defect} from '../../shared/models/defect.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DefectService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Defect[]>(`${this.apiUrl}/api/defect`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/defect/${id}`);
    }

    create(defect: Defect) {
        return this.http.post(`${this.apiUrl}/api/defect`, defect);
    }

    update(defect: Defect) {
        return this.http.put(`${this.apiUrl}/api/defect/${defect.id}`, defect);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/defect/${id}`);
    }

    updateNotes(defect: Defect) {
        return this.http.put(`${this.apiUrl}/api/defect/notes/${defect.id}`, defect);
    }

    changeStatus(defect: any) {
        return this.http.post(`${this.apiUrl}/api/defect/${defect.id}/change-status`, {'status': defect.status});
    }

    changeSeverity(defect: any) {
        return this.http.post(`${this.apiUrl}/api/defect/${defect.id}/change-severity`, {'severity': defect.severity});
    }

    getDefectGeneratedId() {
        return this.http.get(`${this.apiUrl}/api/defect/get-generated-id`);
    }

    getDefectPermission(id, type) {
        return this.http.get(`${this.apiUrl}/api/defect/${id}/permission/${type}`, {});
    }

    getDefectForKanban(defect: any) {
        return this.http.post(`${this.apiUrl}/api/defect/kanban`, defect);
    }

    updateKanbanStatusList(defect: any) {
        return this.http.post(`${this.apiUrl}/api/defect/update-kanban`, defect);
    }

    getDefectForCalendar(obj = {}) {
        return this.http.post(`${this.apiUrl}/api/defect/calendar`, obj);
    }
}
