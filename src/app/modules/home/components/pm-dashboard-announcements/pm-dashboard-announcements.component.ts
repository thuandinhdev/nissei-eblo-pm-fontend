import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-pm-dashboard-announcements',
    templateUrl: './pm-dashboard-announcements.component.html',
    styleUrls: ['./pm-dashboard-announcements.component.scss']
})

export class PmDashboardAnnouncementsComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() announcements;
    @Input() loginUser;

    constructor() {
    }

    ngOnInit() {
    }
}
