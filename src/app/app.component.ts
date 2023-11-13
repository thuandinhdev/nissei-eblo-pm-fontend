import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {AuthenticationService} from './core/services/authentication.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
    loginUser: any;
    title = 'VipsPM';

    constructor(
        public translate: TranslateService,
        public authenticationService: AuthenticationService
    ) {

        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);

        if (this.loginUser) {
            // translate.setDefaultLang(this.loginUser.language);
            translate.use(this.loginUser.language);
        } else {
            translate.setDefaultLang('en');
            // translate.use('en');
        }

        if (localStorage.getItem('permissions') != 'undefined' && localStorage.getItem('permissions') != null) {
            authenticationService.setUserPermissions(JSON.parse(localStorage.getItem('permissions')));
        }
    }

    ngOnInit() {
    }

}
