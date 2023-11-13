import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {
    activeActiveReportTab = '1';

    constructor() {
    }

    ngOnInit() {
    }

    setActiveReportTab($event) {
        this.activeActiveReportTab = $event.id;
    }

    getActiveReportTab(tab) {
        return this.activeActiveReportTab === tab;
    }
}
