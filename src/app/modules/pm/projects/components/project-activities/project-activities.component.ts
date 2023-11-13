import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

@Component({
    selector: 'app-project-activities',
    templateUrl: './project-activities.component.html',
    styleUrls: ['./project-activities.component.scss']
})

export class ProjectActivitiesComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() project;
    @Input() loginUser: any;
    @Input() apiUrl;

    constructor() {
    }

    ngOnInit() {
    }
}
