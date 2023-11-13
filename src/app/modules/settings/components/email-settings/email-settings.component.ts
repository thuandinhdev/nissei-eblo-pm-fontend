import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {NgOption} from '@ng-select/ng-select';

import {SettingService} from '../../../../core/services/setting.service';

@Component({
    selector: 'app-email-settings',
    templateUrl: './email-settings.component.html',
    styleUrls: ['./email-settings.component.scss']
})

export class EmailSettingsComponent implements OnInit {
    @Input() settings: any;
    settingsForm: FormGroup;
    isSubmitted = false;
    smtpHosts: NgOption[] = [
        {value: 'smtp', label: 'SMTP'},
        // { value: 'sendmail', label: 'Send Mail' },
        // { value: 'sparkpost', label: 'Spark Post' },
        // { value: 'mailgun', label: 'Mailgun' },
        // { value: 'mandrill', label: 'Mandrill' },
    ];
    mailEncryption: NgOption[] = [
        {value: 'ssl', label: 'SSL'},
        {value: 'tls', label: 'TLS'},
    ];
    res: any;

    constructor(
        public translate: TranslateService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private settingService: SettingService
    ) {
    }

    get emailSettings() {
        return this.settingsForm.controls;
    }

    ngOnInit() {
        this.settingsForm = this.formBuilder.group({
            form_for: ['email_setting'],
            company_from_email: [this.settings.company_from_email, [Validators.required, Validators.email]],
            post_mark: [this.settings.post_mark],
            smtp_protocol: [this.settings.smtp_protocol, Validators.required],
            smtp_host: [this.settings.smtp_host, Validators.required],
            smtp_user: [this.settings.smtp_user, [Validators.required, Validators.email]],
            smtp_password: [this.settings.smtp_password, Validators.required],
            smtp_port: [this.settings.smtp_port, Validators.required],
            smtp_encryption: [this.settings.smtp_encryption],
            sparkpost_secret: [this.settings.sparkpost_secret],
            mailgun_domain: [this.settings.mailgun_domain],
            mailgun_secret: [this.settings.mailgun_secret],
            mandrill_secret: [this.settings.mandrill_secret]
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.settingsForm.invalid) {
            return;
        }

        this.settingService.create(this.settingsForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.messages.update'), this.translate.instant('settings.title'));
                });
    }

    sendTestEmail() {
        this.settingService.sendTestEmail().subscribe(data => {
            this.res = data;
            if (this.res.status) {
                this.toastr.success(this.translate.instant('settings.email_settings.title1') + this.res.email, this.translate.instant('settings.title'));
            } else {
                this.toastr.error(this.res.msg);
            }
        }, error => {
        });
    }

}
