import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';

import {AuthenticationService} from '../../core/services/authentication.service';
import {SettingService} from 'src/app/core/services/setting.service';

import {MustMatch} from './../../core/helpers/must-match.validator';
import {environment} from 'src/environments/environment';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup;
    settings: any;
    backgroundImage: string;
    isFormSubmitted = false;
    isSettingsLoad = false;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private settingService: SettingService
    ) {
    }

    get userControl() {
        return this.resetPasswordForm.controls;
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.getVerifyToken(params.get('email'), params.get('token'));
            this.loadForm(params);
        });

        this.getSettings();
    }

    loadForm(params) {
        this.resetPasswordForm = this.formBuilder.group({
            email: [params.get('email')],
            token: [params.get('token')],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            password_confirmation: ['', Validators.required],
        }, {
            validator: MustMatch('password', 'password_confirmation')
        });
    }

    getVerifyToken(email, token) {
        this.authenticationService.getVerifyUserToken({email: email, token: token})
            .subscribe((data) => {
                },
                (error) => {
                    this.toastr.success(this.translate.instant('reset_password.create.error_messages.message5'), this.translate.instant('reset_password.title'));
                    this.router.navigate(['login']);
                });
    }

    getSettings() {
        this.settingService.getSettings()
            .subscribe(
                data => {
                    this.settings = data;
                    this.setBGImage();
                    this.isSettingsLoad = true;
                });
    }

    setBGImage() {
        if (this.settings.login_background) {
            this.backgroundImage = this.apiUrl + '/uploads/login_bg/' + this.settings.login_background;
        } else {
            this.backgroundImage = 'assets/img/login-bg-2.png';
        }
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.resetPasswordForm.invalid) {
            return;
        }

        this.authenticationService.resetPassword(this.resetPasswordForm.value)
            .subscribe((data) => {
                this.toastr.success(this.translate.instant('reset_password.messages.success'), this.translate.instant('reset_password.title'));
                this.router.navigate(['login']);
            });

    }

}
