import {Component, Input, OnInit} from '@angular/core';

import {DashboardSettingService} from '../../../../core/services/dashboard-setting.service';

@Component({
    selector: 'app-dashboard-settings',
    templateUrl: './dashboard-settings.component.html',
    styleUrls: ['./dashboard-settings.component.scss']
})
export class DashboardSettingsComponent implements OnInit {

    isCollapsed: boolean = false;
    @Input() dashboardSettings: any;

    constructor(
        private dashboardSettingService: DashboardSettingService
    ) {
    }

    ngOnInit() {
    }

    toggleDashboardSettings() {
        if (this.isCollapsed) {
            this.isCollapsed = false;
        } else {
            this.isCollapsed = true;
        }
    }

    saveDashboardSetting(value: boolean, column) {
        this.dashboardSettings[column] = value;
        this.dashboardSettingService.create({[column]: value}).subscribe(data => {
        });
    }

}
