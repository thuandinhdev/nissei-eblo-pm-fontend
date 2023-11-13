import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Team} from '../../shared/models/team.model';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TeamService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Team[]>(`${this.apiUrl}/api/teams`);
    }

    getById(id: number) {
        return this.http.get(`${this.apiUrl}/api/teams/${id}`);
    }

    create(team: Team) {
        return this.http.post(`${this.apiUrl}/api/teams`, team);
    }

    update(team: Team) {
        return this.http.put(`${this.apiUrl}/api/teams/${team.id}`, team);
    }

    delete(id: number) {
        return this.http.delete(`${this.apiUrl}/api/teams/${id}`);
    }

    getTeamForTeamBoard() {
        return this.http.get(`${this.apiUrl}/api/teams/teamboard`);
    }

    import(importTeams) {
        return this.http.post(`${this.apiUrl}/api/teams/import`, importTeams);
    }
}
