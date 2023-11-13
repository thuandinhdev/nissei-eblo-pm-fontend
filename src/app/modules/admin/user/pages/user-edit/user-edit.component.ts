import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {NgxRolesService} from 'ngx-permissions';

import {UserService} from '../../../../../core/services/user.service';
import {DepartmentService} from '../../../../../core/services/department.service';
import {HelperService} from '../../../../../core/services/helper.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {TranslationService} from '../../../../../core/services/translation.service';

import {AssignUserComponent} from '../../components/assign-user/assign-user.component';
import {UserAvatars} from '../../../../../core/helpers/admin.helper';
import {environment} from '../../../../../../environments/environment';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit {
    public modalRef: BsModalRef;
    editUserForm: FormGroup;
    selectedDepartmentRoles: any;
    countries: any;
    languages: any;
    user: any;
    loginUser: any;
    assignUserPermissions: any;
    selected: any;
    users = [];
    avatars = UserAvatars;
    isFormSubmitted = false;
    isPermissionRequired = false;
    departmentsRoles = [];
    departmentsObj = [];
    isPageLoaded = false;
    isProfileLoaded = true;
    isButtonShow = false;
    @ViewChild('pdfDropzone', {static: false}) pdfDropzone: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private departmentService: DepartmentService,
        private userService: UserService,
        private helperService: HelperService,
        private translationService: TranslationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        this.route.paramMap.subscribe(params => {
            this.getUserById(params.get('id'));
        });
    }

    get userControl() {
        return this.editUserForm.controls;
    }

    ngOnInit() {
        this.getCountries();
        this.getLanguages();
        this.getUsers();
    }

    checkUserHavePermission(user) {
        let roleName = this.ngxRolesService.getRole('admin'),
            isEditable = false;

        if (roleName && roleName.name == 'admin' || this.loginUser.is_super_admin) {
            isEditable = true;
        } else if (!user.permission) {
            isEditable = false;
        } else {
            if (user.permission == 'all') {
                for (let iRow in this.assignUserPermissions) {
                    if (this.assignUserPermissions[iRow].id == this.loginUser.id) {
                        isEditable = true;
                    }
                }
            } else {
                if (typeof user.permission == 'string') {
                    let loginUserPermissions = JSON.parse(user.permission);

                    if (loginUserPermissions[this.loginUser.id]) {
                        for (let iRow in loginUserPermissions[this.loginUser.id]) {
                            if (loginUserPermissions[this.loginUser.id][iRow] == 'edit') {
                                isEditable = true;
                            }
                        }
                    }
                } else {
                    isEditable = false;
                }
            }
        }

        if (!isEditable) {
            this.router.navigate(['users']);
        }
    }

    getAssignUserPermissions() {
        this.userService.getUserPermissions()
            .subscribe(
                data => {
                    this.assignUserPermissions = data;
                    this.checkUserHavePermission(this.user);
                });
    }

    getUserById(userId) {
        this.userService.getById(userId)
            .subscribe(
                data => {
                    this.user = data;
                    this.getAssignUserPermissions();
                    this.getDepartments();
                });
    }

    getDepartments() {
        this.departmentService.getAll()
            .subscribe(
                data => {
                    this.getDepartmentsRoles(data);
                });
    }

    getLanguages() {
        this.translationService.getAllActiveTranslations()
            .subscribe(
                data => {
                    this.languages = data;
                });
    }

    getUsers() {
        this.userService.getAll().subscribe(data => {
            this.users = data;
        });
    }

    getCountries() {
        this.helperService.getCountries()
            .subscribe(
                data => {
                    this.countries = data;
                });
    }

    getDepartmentsRoles(departments) {
        let that = this;
        for (let iRow in departments) {
            for (let jRow in departments[iRow].roles) {
                this.departmentsRoles.push({
                    id: departments[iRow].id + '_' + departments[iRow].roles[jRow].id,
                    role_id: departments[iRow].roles[jRow].id,
                    name: departments[iRow].roles[jRow].name,
                    department_id: departments[iRow].id,
                    department_name: departments[iRow].name
                });
            }
        }

        for (let iRow in this.user.departments) {
            for (let jRow in this.user.departments[iRow].roles) {
                this.departmentsObj.push(this.user.departments[iRow].id + '_' + this.user.departments[iRow].roles[jRow].id);
            }
        }

        this.loadUserForm();
        setTimeout(() => {
            that.loadDropzone();
        });
    }

    loadUserForm() {
        this.editUserForm = this.formBuilder.group({
            id: [this.user.id],
            user_generated_id: [this.user.user_generated_id, Validators.required],
            emp_id: [this.user.emp_id, Validators.required],
            username: [this.user.username, [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^\S*$/)]],
            firstname: [this.user.firstname, [Validators.required, Validators.maxLength(20)]],
            lastname: [this.user.lastname, [Validators.required, Validators.maxLength(20)]],
            email: [this.user.email, [Validators.required, Validators.email]],
            skype: [this.user.skype],
            country: [this.user.country],
            mobile: [this.user.mobile, Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)],
            language: [this.user.language],
            primary_manager: [this.user.primary_manager],
            secondary_manager: [this.user.secondary_manager],
            phone: [this.user.phone, Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)],
            address: [this.user.address],
            is_super_admin: [this.user.is_super_admin],
            avatar: [this.user.avatar],
            assign_permission: ['all'],
            department_roles: [this.departmentsObj, Validators.required],
            permission: ['']
        });

        if (this.user.permission !== 'all') {
            this.isButtonShow = true;
            this.editUserForm.patchValue({assign_permission: 'cutomize'});
            this.user.permission = JSON.parse(this.user.permission);
            this.editUserForm.patchValue({permission: this.user.permission});
        }

        this.setAvatar(this.user.avatar);
        this.selectedDepartmentRoles = this.removeUnderscoreIds(this.departmentsObj);
        this.isPageLoaded = true;
    }

    openAssignUserModal($event) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                assignPermissions: this.user.permission
            }
        };
        this.modalRef = this.modalService.show(AssignUserComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.editUserForm.patchValue({permission: data.permissions});
        });
        return false;
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
                            that.editUserForm.patchValue({avatar: reader.result});
                            that.isProfileLoaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.editUserForm.patchValue({avatar: null});
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
        this.isProfileLoaded = false;
        this.editUserForm.patchValue({avatar: null});
    }

    setAvatar(avatar) {
        if (avatar === this.selected) {
            this.selected = null;
        } else {
            this.selected = avatar;
        }

        this.editUserForm.patchValue({avatar: this.selected});
    }

    isActive(avatar) {
        return this.selected === avatar;
    };

    changePermission(event: any) {
        this.isPermissionRequired = false;
        if (event.target.value == 'cutomize') {
            this.user.permission = [];
        }
    }

    departmentRolesChange(event: any) {
        this.selectedDepartmentRoles = event;
    }

    removeUnderscoreIds(ids) {
        let idsObj = [];
        for (let iRow in ids) {
            let splitIds = ids[iRow].split('_');
            idsObj.push({
                department_id: splitIds[0],
                role_id: splitIds[1],
            });
        }

        return idsObj;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editUserForm.invalid) {
            return;
        }

        if (this.userControl.assign_permission.value == 'cutomize' && this.editUserForm.value.permission.length == 0) {
            this.isPermissionRequired = true;
            return false;
        }

        // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // this.router.navigate(['users']);
        // return;

        this.editUserForm.value.department_roles = this.selectedDepartmentRoles;
        this.editUserForm.value.UserAvatars = this.avatars;
        this.userService.update(this.editUserForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('users.messages.update'), this.translate.instant('users.title'));
                    this.router.navigate(['users']);
                });

    }

}
