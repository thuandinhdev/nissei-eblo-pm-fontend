import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ProjectAttachment} from '../../shared/models/project-attachment.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ProjectAttachmentService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAllAttachmentById(projectId: number) {
        return this.http.get<ProjectAttachment>(`${this.apiUrl}/api/project-attachment/${projectId}`);
    }

    create(projectAttachment: ProjectAttachment) {
        return this.http.post(`${this.apiUrl}/api/project-attachment`, projectAttachment);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/project-attachment/${id}`);
    }
}
