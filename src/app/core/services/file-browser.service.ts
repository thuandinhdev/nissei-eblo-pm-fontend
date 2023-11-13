import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Folder} from '../../shared/models/folder.model';
import {File} from '../../shared/models/file.model';

import {environment} from '../../../environments/environment';

const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
    providedIn: 'root'
})

export class FileBrowserService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getFolders(reqObj) {
        return this.http.get(`${this.apiUrl}/api/file-browser`, {params: reqObj});
    }

    createFolder(reqObj) {
        return this.http.post(`${this.apiUrl}/api/file-browser`, reqObj, options);
    }

    getById(current_folder_id) {
        return this.http.get(`${this.apiUrl}/api/file-browser/${current_folder_id}`);
    }

    updateFolder(folder: Folder) {
        return this.http.put(`${this.apiUrl}/api/file-browser/${folder.id}`, folder);
    }

    deleteFolder(id: number) {
        return this.http.delete(`${this.apiUrl}/api/file-browser/${id}`);
    }

    getFolderBreadcrumb(reqObj) {
        return this.http.get(`${this.apiUrl}/api/file-browser/breadcrumb`, {params: reqObj});
    }

    getFiles(reqObj) {
        return this.http.get(`${this.apiUrl}/api/files`, {params: reqObj});
    }

    updateFile(file: File) {
        return this.http.put(`${this.apiUrl}/api/files/${file.id}`, file);
    }

    deleteFile(id: number) {
        return this.http.delete(`${this.apiUrl}/api/files/${id}`);
    }

    removeAttachments(dataObj: any) {
        return this.http.post(`${this.apiUrl}/api/files/attachment/remove`, dataObj);
    }

}
