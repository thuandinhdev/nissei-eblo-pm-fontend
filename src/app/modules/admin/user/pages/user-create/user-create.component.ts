import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {TranslateService} from '@ngx-translate/core';

import {DepartmentService} from '../../../../../core/services/department.service';
import {UserService} from '../../../../../core/services/user.service';
import {HelperService} from '../../../../../core/services/helper.service';
import {TranslationService} from '../../../../../core/services/translation.service';

import {AssignUserComponent} from '../../components/assign-user/assign-user.component';

import {MustMatch} from './../../../../../core/helpers/must-match.validator';

import * as Dropzone from 'dropzone';
import {RegExpEnum} from '../../../../../core/helpers/app.helper';
import {UserAvatars} from '../../../../../core/helpers/admin.helper';
import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.scss']
})

export class UserCreateComponent implements OnInit {
    public apiUrl = environment.apiUrl;
    public modalRef: BsModalRef;
    createUserForm: FormGroup;
    departmentsRoles: {};
    selectedDepartmentRoles: any;
    countries: any;
    languages: any;
    selected: any;
    users = [];
    avatars = UserAvatars;
    isFormSubmitted = false;
    isPageLoaded = false;
    isPermissionRequired = false;
    isProfileLoaded = true;
    isProfileUploded = false;
    modalConfigs = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered modal-md animated fadeIn'
    };

    @ViewChild('pdfDropzone', {static: false}) pdfDropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private departmentService: DepartmentService,
        private userService: UserService,
        private helperService: HelperService,
        private translationService: TranslationService
    ) {
    }

    get userControl() {
        return this.createUserForm.controls;
    }

    ngOnInit() {
        this.getDepartments();
        this.getCountries();
        this.getLanguages();
        this.getUserGeneratedId();
        this.getUsers();
        this.loadForms();
    }

    loadForms() {
        let that = this;
        this.createUserForm = this.formBuilder.group({
            user_generated_id: ['USR0001', Validators.required],
            emp_id: ['USR0001', Validators.required],
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^\S*$/)]],
            firstname: ['', [Validators.required, Validators.maxLength(20)]],
            lastname: ['', [Validators.required, Validators.maxLength(20)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            password_confirmation: ['', Validators.required],
            skype: [''],
            country: [null],
            mobile: ['', Validators.pattern(RegExpEnum.phone_regular_expression)],
            language: ['en'],
            primary_manager: [null],
            secondary_manager: [null],
            phone: ['', Validators.pattern(RegExpEnum.phone_regular_expression)],
            address: [''],
            is_super_admin: [false],
            avatar: [null],
            assign_permission: ['all'],
            department_roles: ['', Validators.required],
            permission: ['']
        }, {
            validator: MustMatch('password', 'password_confirmation')
        });

        this.isPageLoaded = true;
        setTimeout(() => {
            that.loadDropzone();
        });
    }

    loadDropzone() {
        let that = this;
        new Dropzone(this.pdfDropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
            acceptedFiles: 'image/*',
            createImageThumbnails: true,
            init: function () {
                this.on('addedfile', function (file) {
                    const removeButton = Dropzone.createElement('<button class=\'btn btn-sm btn-block\'>' + that.translate.instant('common.remove_file') + '</button>');
                    const _this = this;
                    removeButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.removeFile(file);
                    });

                    file.previewElement.appendChild(removeButton);

                    if (file) {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            that.createUserForm.patchValue({avatar: reader.result});
                            that.isProfileLoaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.createUserForm.patchValue({avatar: null});
                    that.isProfileLoaded = false;
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    removeDropzoneImage() {
        this.isProfileUploded = true;
        this.isProfileLoaded = false;
        this.createUserForm.patchValue({avatar: null});
    }

    setAvatar(avatar) {
        if (avatar === this.selected) {
            this.selected = null;
        } else {
            this.selected = avatar;
        }
        this.createUserForm.patchValue({avatar: this.selected});
    }

    isActive(avatar) {
        return this.selected === avatar;
    };

    getDepartments() {
        this.departmentService.getAll()
            .subscribe(
                data => {
                    this.departmentsRoles = data;
                });
    }

    getLanguages() {
        this.translationService.getAllActiveTranslations()
            .subscribe(
                data => {
                    this.languages = data;
                });
    }

    getCountries() {
        this.helperService.getCountries()
            .subscribe(
                data => {
                    this.countries = data;
                });
    }

    getUserGeneratedId() {
        this.userService.getUserGeneratedId().subscribe(data => {
            this.createUserForm.patchValue({user_generated_id: data});
            this.createUserForm.patchValue({emp_id: data});
        });
    }

    getUsers() {
        this.userService.getAll().subscribe(data => {
            this.users = data;
        });
    }

    departmentRolesChange(event: any) {
        this.selectedDepartmentRoles = event;
    }

    changePermission(event: any) {
        this.isPermissionRequired = false;
        if (event.target.value == 'cutomize') {
            this.modalRef = this.modalService.show(AssignUserComponent, this.modalConfigs);
            this.modalRef.content.event.subscribe(data => {
                this.createUserForm.patchValue({permission: data.permissions});
            });
        }
    }

    onSubmit() {
        this.createUserForm.value.department_roles = [];

        this.isFormSubmitted = true;
        if (this.userControl.assign_permission.value == 'cutomize' && this.createUserForm.value.permission.length == 0) {
            this.isPermissionRequired = true;
            return false;
        }

        if (this.createUserForm.invalid) {
            return;
        }

        if (this.selectedDepartmentRoles) {
            for (let iRow in this.selectedDepartmentRoles) {
                if (this.selectedDepartmentRoles[iRow].pivot) {
                    this.createUserForm.value.department_roles.push(this.selectedDepartmentRoles[iRow].pivot);
                }
            }
        }

        this.userService.create(this.createUserForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('users.messages.create'), this.translate.instant('users.title'));
                    this.router.navigate(['users']);
                });
    }

}
