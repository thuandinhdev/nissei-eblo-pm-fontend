import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {TeamService} from './../../../../../core/services/team.service';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-team-board',
    templateUrl: './team-board.component.html',
    styleUrls: ['./team-board.component.scss']
})

export class TeamBoardComponent implements OnInit {
    teams: any;
    isPageLoaded = false;
    private apiUrl = environment.apiUrl;

    constructor(
        private teamService: TeamService,
        private http: HttpClient,
    ) {
    }

    ngOnInit() {
        this.getTeamForTeamBoard();

    }

    getTeamForTeamBoard() {
        this.teamService.getTeamForTeamBoard()
            .subscribe(
                data => {
                    this.teams = data;
                    this.isPageLoaded = true;
                }
            );
    }
}
