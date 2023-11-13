import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxRolesService} from 'ngx-permissions';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';

import {TeamService} from '../../../../../core/services/team.service';
import {ProjectService} from '../../../../../core/services/project.service';
import {IncidentService} from '../../../../../core/services/incident.service';
import {CustomFieldsService} from '../../../../../core/services/custom-fields.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

@Component({
    selector: 'app-incident-edit',
    templateUrl: './incident-edit.component.html',
    styleUrls: ['./incident-edit.component.scss'],
    preserveWhitespaces: true
})

export class IncidentEditComponent implements OnInit {
    editIncidentForm: FormGroup;
    projects: any;
    projectVersions: any;
    projectStartDate: any;
    incident: any;
    loginUser: any;
    customFields: any = {length: 0};
    isFormSubmitted = false;
    isPageLoaded = false;
    teams = [];
    teamsMembers = [];
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public datepipe: DatePipe,
        public ngxRolesService: NgxRolesService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private teamService: TeamService,
        private projectService: ProjectService,
        private incidentService: IncidentService,
        private customFieldsService: CustomFieldsService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        this.route.paramMap.subscribe(params => {
            this.getIncidentById(params.get('id'));
        });
    }

    get incidentControl() {
        return this.editIncidentForm.controls;
    }

    ngOnInit() {
    }

    loadForms() {
        // --
        // Dates
        if (this.incident.project) {
            this.projectStartDate = new Date(this.incident.project.start_date);
        }

        if (this.incident.start_date) {
            this.incident.start_date = new Date(this.incident.start_date);
        }

        this.editIncidentForm = this.formBuilder.group({
            id: [this.incident.id],
            generated_id: [this.incident.generated_id, Validators.required],
            incident_name: [this.incident.incident_name, [Validators.required, Validators.maxLength(255)]],
            start_date: [this.incident.start_date],
            end_date: [this.incident.end_date],
            project_id: [this.incident.project_id],
            project_version: [this.incident.project_version],
            status: [this.incident.status, Validators.required],
            priority: [this.incident.priority, Validators.required],
            estimated_hours: [this.incident.estimated_hours, Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            assigned_group_id: [this.incident.assigned_group_id],
            assign_to: [this.incident.assign_to],
            incident_type: [this.incident.incident_type, Validators.required],
            description: [this.incident.description],
            custom_field: this.formBuilder.array([]),
            custom_fields: [null],
        });

        this.getCustomFieldByForm();
        this.isPageLoaded = true;
    }

    getCheckPermission(incident) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
        } else if (incident.assign_to == this.loginUser.id || incident.create_user_id == this.loginUser.id) {
        } else {
            this.router.navigate(['incidents']);
        }
    }

    getProjects() {
        this.projectService.getMyProjects().subscribe(data => {
            this.projects = data;
            this.getProjectVersions();
        });
    }

    getTeams() {
        this.teamService.getAll().subscribe(data => {
            this.teams = data;
            let selectedTeam = this.teams.find(i => i.id == this.incident.assigned_group_id);

            this.getProjects();
            this.loadForms();
            this.assignGroupChange(selectedTeam);
        });
    }

    getProjectVersions() {
        for (let iRow in this.projects) {
            if (this.projects[iRow].id == this.incident.project_id) {
                this.projectVersions = this.projects[iRow].project_version.split(',');
            }
        }
    }

    getCustomFieldByForm() {
        this.customFieldsService.getCustomFieldByForm(4)
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
            let control = <FormArray>this.editIncidentForm.controls.custom_field;
            let validators = null;
            if (element.is_required == 1) {
                validators = [Validators.required];
            }
            if (element.field_type == 'date' && this.incident[element.field_column] != null) {
                control.push(
                    this.formBuilder.group({
                        [element.field_column]: [new Date(this.incident[element.field_column]), validators]
                    })
                );
            } else {
                control.push(
                    this.formBuilder.group({
                        [element.field_column]: [this.incident[element.field_column], validators]
                    })
                );
            }
        });
    }

    assignGroupChange(event: any) {
        if (this.editIncidentForm.value.assigned_group_id == undefined || this.editIncidentForm.value.assigned_group_id == null || this.editIncidentForm.value.assigned_group_id == '') {
            this.editIncidentForm.patchValue({assign_to: null});
            this.teamsMembers = null;
            return;
        }
        this.teamsMembers = event.members;
    }

    projectChange(event: any) {
        this.editIncidentForm.patchValue({project_version: null});
        this.editIncidentForm.patchValue({start_date: null});
        this.editIncidentForm.patchValue({end_date: null});
        if (this.editIncidentForm.value.project_id == undefined || this.editIncidentForm.value.project_id == null || this.editIncidentForm.value.project_id == '') {
            this.projectVersions = null;
            return;
        }
        this.projectVersions = event.project_version.split(',');
        // --
        // Dates
        this.projectStartDate = new Date(event.start_date);
    }

    startDateChange() {
        this.editIncidentForm.patchValue({end_date: this.editIncidentForm.value.start_date});
    }

    getIncidentById(incidentId) {
        this.incidentService.getById(incidentId)
            .subscribe(
                data => {
                    this.incident = data;
                    this.getCheckPermission(this.incident);
                    this.getTeams();
                });
    }

    setCustomFields() {
        let arr = this.editIncidentForm.value.custom_field,
            obj = {},
            iRow = 0,
            that = this;
        arr.forEach(function (item) {
            let key = Object.keys(item)[0];
            obj[key] = item[key];
            if (that.customFields[iRow++].field_type == 'date') {
                obj[key] = that.datepipe.transform(item[key], 'yyyy-MM-dd');
            }
        });
        this.editIncidentForm.patchValue({custom_fields: obj});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editIncidentForm.invalid) {
            return;
        }

        if (this.customFields.length > 0) {
            this.setCustomFields();
        }

        if (this.editIncidentForm.invalid) {
            return;
        }

        this.editIncidentForm.value.start_date = this.datepipe.transform(this.editIncidentForm.value.start_date, 'yyyy-MM-dd');
        this.editIncidentForm.value.end_date = this.datepipe.transform(this.editIncidentForm.value.end_date, 'yyyy-MM-dd');
        this.incidentService.update(this.editIncidentForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('incidents.messages.update'), this.translate.instant('incidents.title'));
            this.router.navigate(['incidents']);
        });
    }

}
