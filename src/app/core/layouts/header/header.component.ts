import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {ToastrService} from 'ngx-toastr';

import {AuthenticationService} from '../../../core/services/authentication.service';
// import { DashboardService } from '../../../core/services/dashboard.service';
// import { MailService } from '../../../core/services/mail.service';
import {HelperService} from '../../../core/services/helper.service';
import {TranslationService} from '../../../core/services/translation.service';
import {UserService} from '../../../core/services/user.service';
import {environment} from './../../../../environments/environment';

declare var jQuery: any;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    loginUser: any;
    // mails: any;
    latestVersion: any;
    // todaysActivities: any;
    translations: any;
    selectedLanguage: string;
    private apiUrl = environment.apiUrl;

    // interval: any;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private helperService: HelperService,
        // private dashboardService: DashboardService,
        // private mailService: MailService,
        private translationService: TranslationService,
        private userService: UserService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);

        if (this.loginUser) {
            this.selectedLanguage = this.loginUser.language;
        }
    }

    ngOnInit() {
        // this.getTodayActivities(8);
        // this.getUnReadMails(8);
        this.getAllActiveTranslations();

        // --
        // Interval
        // this.interval = timer(60000, 30000).pipe().subscribe(x => {
        // 	this.getUnReadMails(8);
        // });
    }

    openThemeSettings() {
        $('.theme-settings').toggleClass('open');
    }

    // getTodayActivities(length) {
    // 	this.dashboardService.getTodayActivities(length).subscribe(data => {
    // 		this.todaysActivities = data;
    // 	}, error => {
    // 		this.interval.unsubscribe();
    // 	});
    // }

    // getUnReadMails(length) {
    // 	this.mailService.getUnReadMails(length).subscribe(data => {
    // 		this.mails = data;
    // 	}, error => {
    // 		this.interval.unsubscribe();
    // 	});
    // }

    // executeCronJob(){
    // 	this.helperService.executeCronJob().subscribe(data => {})
    // }

    logout() {
        // this.interval.unsubscribe();
        this.authenticationService.logout();
    }

    getAllActiveTranslations() {
        this.translationService.getAllActiveTranslations().subscribe(data => {
            this.translations = data;
        });
    }

    changeLanguage(language: string) {
        this.translate.use(language);
        this.changeLocale(language);
    }

    changeLocale(locale: string) {
        this.selectedLanguage = locale;
        this.userService.changeLocale(locale).subscribe(data => {
        });
    }

}
