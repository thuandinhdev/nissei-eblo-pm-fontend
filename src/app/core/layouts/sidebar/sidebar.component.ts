import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

import {User} from '../../../shared/models/user.model';

import {AuthenticationService} from '../../../core/services/authentication.service';
import {SettingService} from '../../services/setting.service';

import {sidebarCollpasedMenu} from '../../../core/helpers/app.helper';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, AfterViewInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() settings;
    menuItems: Array<any>;
    loginUser: User;
    isSettingsLoad: boolean;
    private apiUrl = environment.apiUrl;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private settingService: SettingService
    ) {
        this.menuItems = this.route.snapshot.data.sidebarMenu.menus;
        this.authenticationService.setLoginUser(this.route.snapshot.data.sidebarMenu.loginUser);
        this.loginUser = this.route.snapshot.data.sidebarMenu.loginUser;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            sidebarCollpasedMenu();
        });
    }

    logout() {
        this.authenticationService.logout();
    }
}
