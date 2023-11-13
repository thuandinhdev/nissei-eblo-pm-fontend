import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {DefectComments} from '../../shared/models/defect-comments.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DefectCommentsService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    create(defectComment: DefectComments) {
        return this.http.post(`${this.apiUrl}/api/defect-comment`, defectComment);
    }

    update(defectComment: any) {
        return this.http.put(`${this.apiUrl}/api/defect-comment/${defectComment.id}`, defectComment);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/defect-comment/${id}`);
    }
}
