import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

@Component({
    selector: 'app-pm-dashboard-activity',
    templateUrl: './pm-dashboard-activity.component.html',
    styleUrls: ['./pm-dashboard-activity.component.scss']
})

export class PmDashboardActivityComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() todaysActivity;
    @Input() loginUser;
    @Input() apiUrl;

    constructor() {
    }

    ngOnInit() {
    }

}
