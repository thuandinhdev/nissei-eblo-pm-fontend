import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {UserService} from '../../../../../core/services/user.service';

import {MustMatch} from './../../../../../core/helpers/must-match.validator';

@Component({
    selector: 'app-change-password-modal',
    templateUrl: './change-password-modal.component.html',
    styleUrls: ['./change-password-modal.component.scss']
})

export class ChangePasswordModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    changeUserPasswordForm: FormGroup;
    user: any;
    isFormSubmitted = false;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService
    ) {
    }

    get userControl() {
        return this.changeUserPasswordForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();
    }

    loadForms() {
        this.changeUserPasswordForm = this.formBuilder.group({
            id: this.user.id,
            old_password: [null, Validators.required],
            password: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            password_confirmation: [null, Validators.required],
        }, {
            validator: MustMatch('password', 'password_confirmation')
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.changeUserPasswordForm.invalid) {
            return;
        }

        // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // this.onCancel();
        // return;

        this.userService.changePassword(this.changeUserPasswordForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('users.messages.password_change'), this.translate.instant('users.title'));
                    this.onCancel();
                }, error => {
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

}
