import {Component, Input, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {SettingService} from '../../../../core/services/setting.service';

import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-cronjob-settings',
    templateUrl: './cronjob-settings.component.html',
    styleUrls: ['./cronjob-settings.component.scss']
})

export class CronjobSettingsComponent implements OnInit {
    public apiUrl = environment.apiUrl;
    @Input() settings: any;
    @Input() loginUser: any;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private settingService: SettingService,
    ) {
    }

    ngOnInit() {
    }

    saveCronjobSettings() {
        this.settingService.create(this.settings)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.messages.update'), this.translate.instant('settings.title'));
                });
    }
}
