import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

import {task_status_key_class} from './../../../../core/helpers/pm-helper';

@Component({
    selector: 'app-pm-dashboard-tasks',
    templateUrl: './pm-dashboard-tasks.component.html',
    styleUrls: ['./pm-dashboard-tasks.component.scss']
})

export class PmDashboardTasksComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() tasks;
    @Input() loginUser;
    @Input() apiUrl;
    taskStatusKeyClass = task_status_key_class;

    constructor() {
    }

    ngOnInit() {
    }

}
