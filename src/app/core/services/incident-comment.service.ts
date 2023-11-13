import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {IncidentComments} from '../../shared/models/incident-comments.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class IncidentCommentService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    create(incidentComment: IncidentComments) {
        return this.http.post(`${this.apiUrl}/api/incidentcomment`, incidentComment);
    }

    update(incidentComment: any) {
        return this.http.put(`${this.apiUrl}/api/incidentcomment/${incidentComment.id}`, incidentComment);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/incidentcomment/${id}`);
    }
}
