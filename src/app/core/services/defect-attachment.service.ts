import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {DefectAttachment} from '../../shared/models/defect-attachment.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DefectAttachmentService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAllAttachmentById(defectId: number) {
        return this.http.get<DefectAttachment[]>(`${this.apiUrl}/api/defect-attachment/${defectId}`);
    }

    create(defectAttachment: DefectAttachment) {
        return this.http.post(`${this.apiUrl}/api/defect-attachment`, defectAttachment);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/defect-attachment/${id}`);
    }
}
