import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
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
    selector: 'app-edit-project-modal',
    templateUrl: './edit-project-modal.component.html',
    styleUrls: ['./edit-project-modal.component.scss']
})

export class EditProjectModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editProjectForm: FormGroup;
    project: any;
    projectId: number;
    oldVersion: any;
    currentVersion: any;
    loginUser: any;
    selected: any;
    customFields: any = {length: 0};
    isFormSubmitted = false;
    isPageLoaded = false;
    isLogoLoaded = true;
    clients = [];
    teams = [];
    teamsMembers = [];
    teamMemberId = [];
    teamMemberIds = [];
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
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        public datepipe: DatePipe,
        public bsEditProjectModalRef: BsModalRef,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private projectService: ProjectService,
        private clientService: ClientService,
        private teamService: TeamService,
        private customFieldsService: CustomFieldsService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    get projectPlannerControl() {
        return this.editProjectForm.controls;
    }

    ngOnInit() {
        this.getProjectById(this.projectId);
        this.onClose = new Subject();
        if (!this.loginUser.is_client) {
            this.getClients();
        }
    }

    loadForms() {
        this.editProjectForm = this.formBuilder.group({
            id: [this.project.id],
            generated_id: [this.project.generated_id],
            project_name: [this.project.project_name, [Validators.required, Validators.maxLength(255)]],
            project_version: [this.project.project_version, [Validators.required, Validators.pattern(/^[0-9]{1,2}(?:\.[0-9]{1,2})?$/)]],
            client_id: [this.project.client_id],
            demo_url: [this.project.demo_url, Validators.pattern(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/)],
            start_date: [new Date(this.project.start_date), Validators.required],
            end_date: [new Date(this.project.end_date), Validators.required],
            billing_type: [this.project.billing_type],
            price_rate: [this.project.price_rate, [Validators.minLength(0.1), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
            status: [this.project.status, Validators.required],
            estimated_hours: [this.project.estimated_hours, [Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)]],
            assign_to: [this.project.assign_to],
            assign_members: [this.project.assign_members],
            progress: [this.project.progress],
            project_hours: [this.project.project_hours],
            project_logo: [this.project.project_logo],
            description: [this.project.description],
            users: [],
            custom_field: this.formBuilder.array([]),
            custom_fields: [null]
        });
        this.getCustomFieldByForm();
        this.setLogos(this.project.project_logo);
        this.isPageLoaded = true;
    }

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
                    const removeButton = Dropzone.createElement('<button class=\'btn btn-sm btn-block\'>Remove file</button>');
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
                            that.editProjectForm.patchValue({project_logo: reader.result});
                            this.isLogoLoaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.editProjectForm.patchValue({project_logo: null});
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    setLogos(project_logo) {
        if (project_logo === this.selected) {
            this.selected = null;
        } else {
            this.selected = project_logo;
        }
        this.editProjectForm.patchValue({project_logo: this.selected});
    }

    isActive(avatar) {
        return this.selected === avatar;
    };

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

                    this.setTeamMembers();
                });
    }

    setTeamMembers() {
        this.teamMemberIds = [];
        for (let iRow in this.teams) {
            if (this.teams[iRow].id == this.project.assign_to) {
                for (let jRow in this.teams[iRow].members) {
                    this.teamMemberIds.push({'id': this.teams[iRow].members[jRow].id});
                }
            }
        }

        this.editProjectForm.patchValue({users: this.teamMemberIds});
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
            let control = <FormArray>this.editProjectForm.controls.custom_field;
            let validators = null;
            if (element.is_required == 1) {
                validators = [Validators.required];
            }
            if (element.field_type == 'date' && this.project[element.field_column] != null) {
                control.push(
                    this.formBuilder.group({
                        [element.field_column]: [new Date(this.project[element.field_column]), validators]
                    })
                );
            } else {
                control.push(
                    this.formBuilder.group({
                        [element.field_column]: [this.project[element.field_column], validators]
                    })
                );
            }
        });
    }

    getProjectById(projectID) {
        this.projectService.getById(projectID).subscribe(data => {
            this.project = data;
            let projectAllVersion = this.project.project_version;
            let lastIndex = projectAllVersion.lastIndexOf(',');
            this.oldVersion = projectAllVersion.substring(0, lastIndex);
            this.currentVersion = projectAllVersion.substring(lastIndex + 1);
            this.project.project_version = this.currentVersion;
            this.loadForms();

            setTimeout(() => {
                this.loadDropzone();
            });

            this.getTeams();
        });
    }

    removeDropzoneImage() {
        this.isLogoLoaded = false;
        this.editProjectForm.patchValue({project_logo: null});
    }

    startDateChange(event: any) {
        this.editProjectForm.patchValue({end_date: this.editProjectForm.controls.start_date.value});
    }

    assignGroupChange(event: any) {
        this.teamsMembers = null;
        this.teamMemberIds = [];
        this.editProjectForm.patchValue({assign_members: null});
        if (event) {
            this.teamsMembers = event.members;
            for (let i = 0; i < this.teamsMembers.length; i++) {
                this.teamMemberIds.push({'id': this.teamsMembers[i].id});
            }
        }
        this.editProjectForm.patchValue({users: this.teamMemberIds});
    }

    loadCustomFields() {
        let arr = this.editProjectForm.value.custom_field;
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
        this.editProjectForm.patchValue({custom_fields: obj});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editProjectForm.invalid) {
            return;
        }

        if (this.customFields.length > 0) {
            this.loadCustomFields();
        }

        this.editProjectForm.patchValue({start_date: this.datepipe.transform(this.editProjectForm.value.start_date, 'yyyy-MM-dd')});
        this.editProjectForm.patchValue({end_date: this.datepipe.transform(this.editProjectForm.value.end_date, 'yyyy-MM-dd')});
        this.editProjectForm.value.ProjectLogos = this.logos;
        this.projectService.update(this.editProjectForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('projects.messages.update'), this.translate.instant('projects.title'));
                    this.event.emit({data});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditProjectModalRef.hide();
    }
}
