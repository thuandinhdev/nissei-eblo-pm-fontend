import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Options} from 'ng5-slider';

import {ProjectService} from '../../../../../core/services/project.service';
import {ClientService} from '../../../../../core/services/client.service';
import {TeamService} from '../../../../../core/services/team.service';
import {CustomFieldsService} from '../../../../../core/services/custom-fields.service';

import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {ProjectLogos} from '../../../../../core/helpers/pm-helper';
import {environment} from '../../../../../../environments/environment';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-project-create',
    templateUrl: './project-create.component.html',
    styleUrls: ['./project-create.component.scss'],
    preserveWhitespaces: true
})

export class ProjectCreateComponent implements OnInit {
    public apiUrl = environment.apiUrl;
    createProjectForm: FormGroup;
    customFields: any = {length: 0};
    selected: any;
    loginUser: any;
    isFormSubmitted = false;
    isPageLoaded = false;
    client_id = null;
    clients = [];
    teams = [];
    teamsMembers = [];
    teamsMembersId = [];
    teamsMemberIds = [];
    logos = ProjectLogos;
    progressOptions: Options = {
        floor: 0,
        ceil: 100
    };
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    @ViewChild('logodropzone', {static: false}) logodropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        public datepipe: DatePipe,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private projectService: ProjectService,
        private clientService: ClientService,
        private teamService: TeamService,
        private customFieldsService: CustomFieldsService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    get projectControl() {
        return this.createProjectForm.controls;
    }

    ngOnInit() {
        if (this.loginUser.is_client) {
            this.client_id = this.loginUser.id;
        } else {
            this.getClients();
        }
        this.getTeams();
        this.loadForms();
        this.getCustomFieldByForm();
    }

    loadForms() {
        let that = this;
        this.createProjectForm = this.formBuilder.group({
            project_name: ['', [Validators.required, Validators.maxLength(255)]],
            project_version: ['', [Validators.required]],
            client_id: [this.client_id],
            demo_url: ['', Validators.pattern(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/)],
            start_date: [new Date(), Validators.required],
            end_date: [new Date(), Validators.required],
            billing_type: [null],
            price_rate: ['', [Validators.minLength(0.1), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
            status: [1, Validators.required],
            estimated_hours: ['', Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            assign_to: [null],
            assign_members: [null],
            progress: [0],
            project_hours: [false],
            project_logo: [''],
            description: [''],
            users: [],
            custom_field: this.formBuilder.array([]),
            custom_fields: [null]
        });

        // if (this.loginUser.is_client) {
        // 	this.createProjectForm.patchValue({ client_id: this.loginUser.id });
        // }

        setTimeout(() => {
            that.loadDropzone();
        });
    }

    setLogos(project_logo) {
        if (project_logo === this.selected) {
            this.selected = null;
        } else {
            this.selected = project_logo;
        }
        this.createProjectForm.patchValue({project_logo: this.selected});
    }

    isActive(avatar) {
        return this.selected === avatar;
    };

    loadDropzone() {
        let that = this;
       new Dropzone(this.logodropzone.nativeElement, {
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
                            that.createProjectForm.patchValue({project_logo: reader.result});
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.createProjectForm.patchValue({project_logo: null});
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    loadCustomFields() {
        let arr = this.createProjectForm.value.custom_field;
        let obj = {};
        let iRow = 0;
        let that = this;
        arr.forEach(function (item) {
            let key = Object.keys(item)[0];
            obj[key] = item[key];
            if (that.customFields[iRow++].field_type == 'date') {
                obj[key] = that.datepipe.transform(item[key], 'yyyy-MM-dd');
            }
        });

        this.createProjectForm.patchValue({custom_fields: obj});
    }

    getCustomFieldByForm() {
        this.customFieldsService.getCustomFieldByForm(1)
            .subscribe(
                data => {
                    this.customFields = data;
                    if (this.customFields.length > 0) {
                        this.addDynamicField(this.customFields);
                    }
                });
    }

    addDynamicField(fieldList) {
        fieldList.forEach(element => {
            let control = <FormArray>this.createProjectForm.controls.custom_field;
            let validators = null;
            if (element.is_required == 1) {
                validators = [Validators.required];
            }

            control.push(
                this.formBuilder.group({
                    [element.field_column]: [null, validators]
                })
            );
        });
    }

    getClients() {
        this.clientService.getAll()
            .subscribe(
                data => {
                    this.clients = data;
                });
    }

    getTeams() {
        this.teamService.getAll()
            .subscribe(
                data => {
                    this.teams = data;
                });
    }

    startDateChange(event: any) {
        this.createProjectForm.patchValue({end_date: event});
    }

    assignGroupChange(event: any) {
        this.teamsMembers = null;
        this.teamsMemberIds = [];
        this.createProjectForm.patchValue({assign_members: null});
        if (event) {
            this.teamsMembers = event.members;
            for (let i = 0; i < this.teamsMembers.length; i++) {
                this.teamsMembersId = this.teamsMembers[i].id;
                this.teamsMemberIds.push(this.teamsMembersId);
            }
        }
        this.createProjectForm.patchValue({users: this.teamsMemberIds});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createProjectForm.invalid) {
            return;
        }

        if (this.customFields.length > 0) {
            this.loadCustomFields();
        }

        this.projectService.create(this.createProjectForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('projects.messages.create'), this.translate.instant('projects.title'));
                    this.router.navigate(['projects']);
                });
    }
}
