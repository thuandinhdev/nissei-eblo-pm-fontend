import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

@Component({
    selector: 'app-pm-dashboard-estimates',
    templateUrl: './pm-dashboard-estimates.component.html',
    styleUrls: ['./pm-dashboard-estimates.component.scss']
})
export class PmDashboardEstimatesComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() estimates;
    @Input() loginUser;
    @Input() apiUrl;

    constructor() {
    }

    ngOnInit() {
    }

}
