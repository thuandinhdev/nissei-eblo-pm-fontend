import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

import {defect_status_key_class} from './../../../../core/helpers/pm-helper';

@Component({
    selector: 'app-pm-dashboard-defects',
    templateUrl: './pm-dashboard-defects.component.html',
    styleUrls: ['./pm-dashboard-defects.component.scss']
})

export class PmDashboardDefectsComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() defects;
    @Input() loginUser;
    @Input() apiUrl;
    defectStatusKeyColor = defect_status_key_class;

    constructor() {
    }

    ngOnInit() {
    }

}
