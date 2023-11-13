import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

@Component({
    selector: 'app-incident-activities',
    templateUrl: './incident-activities.component.html',
    styleUrls: ['./incident-activities.component.scss']
})

export class IncidentActivitiesComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() incident;
    @Input() loginUser: any;
    @Input() apiUrl;

    constructor() {
    }

    ngOnInit() {
    }
}
