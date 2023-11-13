import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {MeetingService} from '../../../../../core/services/meeting.service';
import {AuthenticationService} from 'src/app/core/services/authentication.service';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-meeting-detail',
    templateUrl: './meeting-detail.component.html',
    styleUrls: ['./meeting-detail.component.scss']
})

export class MeetingDetailComponent implements OnInit {
    meeting: any;
    loginUser: any;
    isPageLoaded = false;
    activeMeetingTab = '1';
    private apiUrl = environment.apiUrl;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private meetingService: MeetingService,
        private authenticationService: AuthenticationService
    ) {
        this.route.paramMap.subscribe(params => {
            this.getById(params.get('id'));
        });
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
    }

    getById(taskId) {
        this.meetingService.getById(taskId).subscribe(data => {
                this.meeting = data;
                this.isPageLoaded = true;
            }
        );
    }

}
