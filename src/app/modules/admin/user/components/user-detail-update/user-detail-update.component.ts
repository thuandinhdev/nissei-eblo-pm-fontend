import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {UserService} from '../../../../../core/services/user.service';
import {HelperService} from '../../../../../core/services/helper.service';
import {TranslationService} from '../../../../../core/services/translation.service';

import {UserAvatarModalComponent} from '../../components/user-avatar-modal/user-avatar-modal.component';
import {ChangeEmailModalComponent} from '../../components/change-email-modal/change-email-modal.component';
import {ChangePasswordModalComponent} from '../../components/change-password-modal/change-password-modal.component';

@Component({
    selector: 'app-user-detail-update',
    templateUrl: './user-detail-update.component.html',
    styleUrls: ['./user-detail-update.component.scss'],
    providers: [DatePipe]
})

export class UserDetailUpdateComponent implements OnInit {
    public modalRef: BsModalRef;
    @Input() user: any;
    @Input() loginUser: any;
    @Input() permission: any;
    joindate: Date;
    dob: Date;
    countries = [];
    languages = [];
    users = [];
    modalConfigs = {};
    datepickerConfigs = {dateInputFormat: 'YYYY-MM-DD'};
    isPageLoad = false;

    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private userService: UserService,
        private helperService: HelperService,
        private translationService: TranslationService
    ) {
    }

    ngOnInit() {
        this.getLanguages();
        this.getUsers();
        this.loadForms(this.user);
    }

    loadForms(user) {
        this.modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                user: user
            }
        };
    }

    getUserById(userId) {
        this.userService.getById(userId)
            .subscribe(
                data => {
                    this.loadForms(data);
                });
    }

    getLanguages() {
        let that = this;
        that.translationService.getAllActiveTranslations()
            .subscribe(
                data => {
                    for (let iRow in data) {
                        that.languages.push({
                            label: data[iRow].name,
                            value: data[iRow].language
                        });
                    }
                    that.getCountries();
                });
    }

    getUsers() {
        this.userService.getAll().subscribe(data => {
            for (let iRow in data) {
                this.users.push({
                    label: data[iRow].firstname + ' ' + data[iRow].lastname,
                    value: data[iRow].id
                });
            }
        });
    }

    getCountries() {
        this.helperService.getCountries()
            .subscribe(
                data => {
                    for (let iRow in data) {
                        this.countries.push({
                            label: data[iRow].name,
                            value: data[iRow].code
                        });
                    }
                    this.isPageLoad = true;
                });
    }

    openAvatarChangeModal() {
        this.modalRef = this.modalService.show(UserAvatarModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getUserById(this.user.id);
        });
    }

    changeEmail() {
        this.modalRef = this.modalService.show(ChangeEmailModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
        });
    }

    changePassword() {
        this.modalRef = this.modalService.show(ChangePasswordModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
        });
    }

    saveUserDetail(name, value) {
        if (value instanceof Date) {
            value = this.datePipe.transform(value, 'yyyy-MM-dd');
        }

        this.user[name] = value;
        this.user.type = 'list';
        this.userService.update(this.user)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('users.messages.update'), this.translate.instant('users.title'));
                });
    }

}
