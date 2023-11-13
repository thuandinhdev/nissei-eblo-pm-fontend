import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BackupDatabase} from '../../shared/models/backup-database.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DatabaseBackupService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<BackupDatabase[]>(`${this.apiUrl}/api/database-backups`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/database-backups/${id}`);
    }

    create(backupDatabase) {
        return this.http.post(`${this.apiUrl}/api/database-backups`, backupDatabase);
    }

    update(backupDatabase: BackupDatabase) {
        return this.http.put(`${this.apiUrl}/api/database-backups/${backupDatabase.id}`, backupDatabase);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/database-backups/${id}`);
    }
}
