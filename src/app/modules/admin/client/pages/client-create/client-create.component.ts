import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {DepartmentService} from '../../../../../core/services/department.service';
import {UserService} from '../../../../../core/services/user.service';
import {ClientService} from '../../../../../core/services/client.service';
import {HelperService} from '../../../../../core/services/helper.service';
import {TranslationService} from '../../../../../core/services/translation.service';

import {MustMatch} from './../../../../../core/helpers/must-match.validator';
import {UserAvatars} from '../../../../../core/helpers/admin.helper';
import {environment} from '../../../../../../environments/environment';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-client-create',
    templateUrl: './client-create.component.html',
    styleUrls: ['./client-create.component.scss']
})

export class ClientCreateComponent implements OnInit {
    public apiUrl = environment.apiUrl;
    createClientForm: FormGroup;
    selectedDepartmentRoles: any;
    departmentsRoles: {};
    countries: any;
    languages: any;
    selected: any;
    avatars = UserAvatars;
    isFormSubmitted = false;
    isPageLoaded = false;

    @ViewChild('profiledropzone', {static: false}) profiledropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private departmentService: DepartmentService,
        private userService: UserService,
        private clientService: ClientService,
        private helperService: HelperService,
        private translationService: TranslationService
    ) {
    }

    get clientControl() {
        return this.createClientForm.controls;
    }

    ngOnInit() {
        this.getDepartments();
        this.getCountries();
        this.getLanguages();
    }

    loadForms() {
        let that = this;
        this.createClientForm = this.formBuilder.group({
            user_generated_id: ['USR0001', Validators.required],
            username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^\S*$/)]],
            firstname: ['', [Validators.required, Validators.maxLength(20)]],
            lastname: ['', [Validators.required, Validators.maxLength(20)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
            password_confirmation: ['', Validators.required],
            skype: [''],
            country: [null],
            mobile: ['', Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)],
            language: ['en'],
            phone: ['', Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)],
            address: [''],
            avatar: [null],
            department_roles: ['', Validators.required],
            clients: this.formBuilder.group({
                company_name: [''],
                company_email: ['', [Validators.email]],
                company_phone: ['', Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)],
                company_mobile: ['', [Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)]],
                company_zipcode: [''],
                company_city: [''],
                company_country: [null],
                company_fax: [''],
                company_address: [''],
                website: ['', Validators.pattern(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/)],
                skype_id: [''],
                facebook: [''],
                twitter: [''],
                linkedin: [''],
                hosting_company: [''],
                host_name: [''],
                host_username: [''],
                host_password: [''],
                host_port: ['']
            })
        }, {
            validator: MustMatch('password', 'password_confirmation')
        });

        this.getUserGeneratedId();
        this.isPageLoaded = true;

        setTimeout(() => {
            that.loadDropzone();
        });
    }

    loadDropzone() {
        let that = this;
        new Dropzone(this.profiledropzone.nativeElement, {
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
                            that.createClientForm.patchValue({avatar: reader.result});
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.createClientForm.patchValue({avatar: ''});
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    setAvatar(avatar) {
        if (avatar === this.selected) {
            this.selected = null;
        } else {
            this.selected = avatar;
        }
        this.createClientForm.patchValue({avatar: this.selected});
    }

    isActive(avatar) {
        return this.selected === avatar;
    };

    departmentRolesChange(event: any) {
        this.selectedDepartmentRoles = event;
    }

    getDepartments() {
        this.departmentService.getDepartmentsClientsRoles()
            .subscribe(
                data => {
                    this.departmentsRoles = data;
                    this.loadForms();
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
            this.createClientForm.patchValue({user_generated_id: data});
        });
    }

    onSubmit() {
        this.createClientForm.value.department_roles = [];
        this.isFormSubmitted = true;

        if (this.createClientForm.invalid) {
            return;
        }

        if (this.selectedDepartmentRoles) {
            for (let iRow in this.selectedDepartmentRoles) {
                if (this.selectedDepartmentRoles[iRow].pivot) {
                    this.createClientForm.value.department_roles.push(this.selectedDepartmentRoles[iRow].pivot);
                }
            }
        }

        this.clientService.create(this.createClientForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('clients.messages.create'), this.translate.instant('clients.title'));
                    this.router.navigate(['clients']);
                });
    }

}
