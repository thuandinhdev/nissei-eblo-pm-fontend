import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';

import {AuthenticationService} from '../../core/services/authentication.service';
import {SettingService} from '../../core/services/setting.service';

import {MustMatch} from './../../core/helpers/must-match.validator';
import {environment} from 'src/environments/environment';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    settings: any;
    backgroundImage: string;
    isSettingsLoad = false;
    isFormSubmitted = false;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private settingService: SettingService
    ) {
    }

    get userControl() {
        return this.registerForm.controls;
    }

    ngOnInit() {
        this.getSettings();
        this.loadForm();
    }

    loadForm() {
        this.registerForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^\S*$/)]],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            password_confirmation: ['', Validators.required],
        }, {
            validator: MustMatch('password', 'password_confirmation')
        });
    }

    getSettings() {
        this.settingService.getSettings().subscribe(data => {
            this.settings = data;
            if (!this.settings.allowed_for_registration) {
                this.router.navigate(['login']);
            }
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
        if (this.registerForm.invalid) {
            return;
        }

        this.authenticationService.register(this.registerForm.value)
            .subscribe((data) => {
                this.toastr.success(this.translate.instant('register.messages.success'), this.translate.instant('register.title'));
                this.router.navigate(['login']);
            });

    }
}
