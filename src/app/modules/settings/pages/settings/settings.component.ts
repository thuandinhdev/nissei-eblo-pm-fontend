import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {TabsetComponent} from 'ngx-bootstrap/tabs';

import {SettingService} from '../../../../core/services/setting.service';
import {HelperService} from '../../../../core/services/helper.service';
import {AuthenticationService} from 'src/app/core/services/authentication.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SettingsComponent implements OnInit {
    @ViewChild('tabset', {static: true}) tabset: TabsetComponent;
    countries: any;
    loginUser: any;
    activeSettingTab = '1';
    isSettingsLoad = false;
    settings = [];

    constructor(
        private settingService: SettingService,
        private helperService: HelperService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.getCountries();
    }

    setSettingTab($event) {
        this.activeSettingTab = $event.id;
    }

    getActiveSettingTab(tab) {
        return this.activeSettingTab === tab;
    }

    getCountries() {
        this.helperService.getCountries()
            .subscribe(
                data => {
                    this.countries = data;
                    this.getSettings();
                });
    }

    getSettings() {
        this.settingService.getAll()
            .subscribe(
                data => {
                    this.settings = data;
                    this.isSettingsLoad = true;
                });
    }
}
