import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {SettingService} from '../../../../core/services/setting.service';

@Component({
    selector: 'app-slack-settings',
    templateUrl: './slack-settings.component.html',
    styleUrls: ['./slack-settings.component.scss']
})

export class SlackSettingsComponent implements OnInit {
    @Input() loginUser: any;
    slackSettings: any;
    slackSettingsForm: FormGroup;
    isFormSubmitted = false;
    isFormLoad = false;

    constructor(
        public translate: TranslateService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private settingService: SettingService
    ) {
    }

    get slackSetting() {
        return this.slackSettingsForm.controls;
    }

    ngOnInit() {
        this.getSlackSetting();
    }

    getSlackSetting() {
        this.settingService.getSlackSettings()
            .subscribe(data => {
                this.slackSettings = data;
                this.loadForm();
            });
    }

    loadForm() {
        this.slackSettingsForm = this.formBuilder.group({
            slack_client_id: [this.slackSettings.slack_client_id, Validators.required],
            slack_client_secret: [this.slackSettings.slack_client_secret, Validators.required],
            slack_redirect_URL: [this.slackSettings.slack_redirect_URL, Validators.required],
            slack_status: [this.slackSettings.slack_status]
        });

        this.isFormLoad = true;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.slackSettingsForm.invalid) {
            return;
        }

        this.settingService.createSlackSettings(this.slackSettingsForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('settings.messages.update'), this.translate.instant('settings.title'));
        });
    }

}
