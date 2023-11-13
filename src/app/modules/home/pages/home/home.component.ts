import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';

import {DashboardSettingService} from '../../../../core/services/dashboard-setting.service';
import {DashboardService} from './../../../../core/services/dashboard.service';
import {AuthenticationService} from './../../../../core/services/authentication.service';
import {UserService} from './../../../../core/services/user.service';

import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    public modalRef: BsModalRef;
    isPageLoaded: boolean = false;
    dashboardSettings: any;
    loginUser: any;
    dashboardLists: any;
    dashboardLists1: any;
    length = 5;
    userLists = [];
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private modalService: BsModalService,
        private authenticationService: AuthenticationService,
        private dashboardService: DashboardService,
        private userService: UserService,
        private dashboardSettingService: DashboardSettingService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        translate.use(this.loginUser.language);
    }

    ngOnInit() {
        this.getDashboardSettings();
        this.getDashboardCounts(this.length);
        this.getUsers();
    }

    getDashboardSettings() {
        this.dashboardSettingService.getAll()
            .subscribe(
                data => {
                    this.dashboardSettings = data;
                });
    }

    getUsers() {
        this.userService.getUserkeyBy().subscribe(data => {
            this.userLists = data;
        });
    }

    getDashboardCounts(length) {
        this.dashboardService.getDashboardCounts(length)
            .subscribe(
                data => {
                    this.dashboardLists = data;
                    this.getDashboardLists(this.length);
                });
    }

    getDashboardLists(length) {
        this.dashboardService.getDashboardLists(length)
            .subscribe(
                data => {
                    this.dashboardLists1 = data;
                    this.isPageLoaded = true;
                });
    }
}
