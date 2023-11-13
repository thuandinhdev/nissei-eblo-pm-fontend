import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {DepartmentService} from '../../../../../core/services/department.service';
import {ClientService} from '../../../../../core/services/client.service';
import {HelperService} from '../../../../../core/services/helper.service';
import {TranslationService} from '../../../../../core/services/translation.service';
import {UserAvatars} from '../../../../../core/helpers/admin.helper';
import {environment} from '../../../../../../environments/environment';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-client-edit',
    templateUrl: './client-edit.component.html',
    styleUrls: ['./client-edit.component.scss']
})

export class ClientEditComponent implements OnInit {
    editClientForm: FormGroup;
    selectedDepartmentRoles: any;
    countries: any;
    languages: any;
    client: any;
    selected: any;
    avatars = UserAvatars;
    isFormSubmitted = false;
    departmentsRoles = [];
    departmentsObj = [];
    isPageLoaded = false;
    isProfileLoaded = true;
    @ViewChild('profiledropzone', {static: false}) profiledropzone: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private departmentService: DepartmentService,
        private clientService: ClientService,
        private helperService: HelperService,
        private translationService: TranslationService
    ) {
    }

    get clientControl() {
        return this.editClientForm.controls;
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.getClientById(params.get('id'));
        });
        this.getCountries();
        this.getLanguages();
    }

    loadForms() {
        this.editClientForm = this.formBuilder.group({
            id: [this.client.id],
            user_generated_id: [this.client.user_generated_id, Validators.required],
            username: [this.client.username, [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^\S*$/)]],
            firstname: [this.client.firstname, [Validators.required, Validators.maxLength(20)]],
            lastname: [this.client.lastname, [Validators.required, Validators.maxLength(20)]],
            email: [this.client.email, [Validators.required, Validators.email]],
            skype: [this.client.skype],
            country: [this.client.country],
            mobile: [this.client.mobile, Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)],
            language: [this.client.language],
            phone: [this.client.phone, Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)],
            address: [this.client.address],
            avatar: [this.client.avatar],
            department_roles: [this.departmentsObj, Validators.required],
            clients: this.formBuilder.group({
                company_name: [this.client.clients.company_name],
                company_email: [this.client.clients.company_email, [Validators.email]],
                company_phone: [this.client.clients.company_phone, [Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)]],
                company_mobile: [this.client.clients.company_mobile, [Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)]],
                company_zipcode: [this.client.clients.company_zipcode],
                company_city: [this.client.clients.company_city],
                company_country: [this.client.clients.company_country],
                company_fax: [this.client.clients.company_fax],
                company_address: [this.client.clients.company_address],
                website: [this.client.clients.website, Validators.pattern(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/)],
                skype_id: [this.client.clients.skype_id],
                facebook: [this.client.clients.facebook],
                twitter: [this.client.clients.twitter],
                linkedin: [this.client.clients.linkedin],
                hosting_company: [this.client.clients.hosting_company],
                host_name: [this.client.clients.host_name],
                host_username: [this.client.clients.host_username],
                host_password: [this.client.clients.host_password],
                host_port: [this.client.clients.host_port]
            })
        });

        this.setAvatar(this.client.avatar);
        this.selectedDepartmentRoles = this.removeUnderscoreIds(this.departmentsObj);
        this.isPageLoaded = true;
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
                            that.editClientForm.patchValue({avatar: reader.result});
                            that.isProfileLoaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.editClientForm.patchValue({avatar: null});
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
        this.editClientForm.patchValue({avatar: null});
    }

    setAvatar(avatar) {
        if (avatar === this.selected) {
            this.selected = null;
        } else {
            this.selected = avatar;
        }
        this.editClientForm.patchValue({avatar: this.selected});
    }

    isActive(avatar) {
        return this.selected === avatar;
    };

    getClientById(id) {
        this.clientService.getById(id)
            .subscribe(
                data => {
                    this.client = data;
                    this.getDepartments();
                });
    }

    getDepartments() {
        this.departmentService.getDepartmentsClientsRoles()
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

    getCountries() {
        this.helperService.getCountries()
            .subscribe(
                data => {
                    this.countries = data;
                });
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

        for (let iRow in this.client.departments) {
            for (let jRow in this.client.departments[iRow].roles) {
                this.departmentsObj.push(this.client.departments[iRow].id + '_' + this.client.departments[iRow].roles[jRow].id);
            }
        }

        this.loadForms();
        setTimeout(() => {
            that.loadDropzone();
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editClientForm.invalid) {
            return;
        }

        // // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // this.router.navigate(['clients']);
        // return;

        this.editClientForm.value.department_roles = this.selectedDepartmentRoles;
        this.editClientForm.value.UserAvatars = this.avatars;
        this.clientService.update(this.editClientForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('clients.messages.update'), this.translate.instant('clients.title'));
                    this.router.navigate(['clients']);
                });
    }

}
