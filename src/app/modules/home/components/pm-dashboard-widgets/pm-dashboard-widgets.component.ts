import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-pm-dashboard-widgets',
    templateUrl: './pm-dashboard-widgets.component.html',
    styleUrls: ['./pm-dashboard-widgets.component.scss']
})

export class PmDashboardWidgetsComponent implements OnInit {
    @Input() dashboardLists;
    @Input() dashboardLists1;
    @Input() loginUser;
    @Input() dashboardSettings;

    constructor() {
    }

    ngOnInit() {
    }
}
