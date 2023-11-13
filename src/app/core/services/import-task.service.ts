import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ImportTask} from '../../shared/models/import-task.model';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ImportTaskService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    create(importTask: ImportTask) {
        return this.http.post(`${this.apiUrl}/api/tasks/import`, importTask);
    }
}
