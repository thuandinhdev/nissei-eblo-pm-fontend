import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

@Component({
    selector: 'app-pm-dashboard-meetings',
    templateUrl: './pm-dashboard-meetings.component.html',
    styleUrls: ['./pm-dashboard-meetings.component.scss']
})

export class PmDashboardMeetingsComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() meetings;
    @Input() loginUser;

    constructor() {
    }

    ngOnInit() {
    }

}
