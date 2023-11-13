import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

import {project_status_key_class} from './../../../../core/helpers/pm-helper';

@Component({
    selector: 'app-pm-dashboard-projects',
    templateUrl: './pm-dashboard-projects.component.html',
    styleUrls: ['./pm-dashboard-projects.component.scss']
})

export class PmDashboardProjectsComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() projects;
    @Input() loginUser;
    @Input() userLists;
    @Input() apiUrl;
    projectstatusKeyClass = project_status_key_class;

    constructor() {
    }

    ngOnInit() {
    }

}
