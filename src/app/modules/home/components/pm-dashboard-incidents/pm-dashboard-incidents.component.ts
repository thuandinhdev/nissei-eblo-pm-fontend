import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

import {incident_status_key_class} from './../../../../core/helpers/pm-helper';

@Component({
    selector: 'app-pm-dashboard-incidents',
    templateUrl: './pm-dashboard-incidents.component.html',
    styleUrls: ['./pm-dashboard-incidents.component.scss']
})

export class PmDashboardIncidentsComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() incidents;
    @Input() loginUser;
    @Input() apiUrl;
    incidentStatusKeyClass = incident_status_key_class;

    constructor() {
    }

    ngOnInit() {
    }

}
