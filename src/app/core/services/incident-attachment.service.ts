import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {IncidentAttachment} from '../../shared/models/incident-attachment.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class IncidentAttachmentService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAllAttachmentById(incidentId: number) {
        return this.http.get<IncidentAttachment[]>(`${this.apiUrl}/api/incidentattachment/${incidentId}`);
    }

    create(incidentAttachment: IncidentAttachment) {
        return this.http.post(`${this.apiUrl}/api/incidentattachment`, incidentAttachment);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/incidentattachment/${id}`);
    }
}
