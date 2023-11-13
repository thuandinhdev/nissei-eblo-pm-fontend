import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ImportProject} from '../../shared/models/import-project';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ImportProjectService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    create(importProject: ImportProject) {
        return this.http.post(`${this.apiUrl}/api/projects/import`, importProject);
    }
}
