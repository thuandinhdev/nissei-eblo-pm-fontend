import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

@Component({
    selector: 'app-pm-dashboard-invoices',
    templateUrl: './pm-dashboard-invoices.component.html',
    styleUrls: ['./pm-dashboard-invoices.component.scss']
})
export class PmDashboardInvoicesComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() invoices;
    @Input() loginUser;
    @Input() apiUrl;

    constructor() {
    }

    ngOnInit() {
    }

}
