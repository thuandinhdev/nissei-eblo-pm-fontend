import {Component, Input, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {SettingService} from '../../../../core/services/setting.service';

@Component({
    selector: 'app-email-notifications',
    templateUrl: './email-notifications.component.html',
    styleUrls: ['./email-notifications.component.scss']
})

export class EmailNotificationsComponent implements OnInit {
    @Input() settings: any;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private settingService: SettingService
    ) {
    }

    ngOnInit() {
    }

    saveNotification() {
        this.settingService.create(this.settings)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.messages.update'), this.translate.instant('settings.title'));
                });
    }

}
