import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';
import {TranslateService} from '@ngx-translate/core';

import {TeamService} from '../../../../../core/services/team.service';
import {ProjectService} from '../../../../../core/services/project.service';
import {DefectService} from '../../../../../core/services/defect.service';
import {CustomFieldsService} from '../../../../../core/services/custom-fields.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {environment} from '../../../../../../environments/environment';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-defect-edit',
    templateUrl: './defect-edit.component.html',
    styleUrls: ['./defect-edit.component.scss'],
    preserveWhitespaces: true
})

export class DefectEditComponent implements OnInit {
    editDefectForm: FormGroup;
    loginUser: any;
    projects: any;
    projectVersion: any;
    projectStartDate: any;
    defect: any;
    customFields: any = {length: 0};
    isFormSubmitted = false;
    isPageLoaded = false;
    isLogoUploaded = false;
    isLogoLoaded = true;
    clients = [];
    teams = [];
    teamsMembers = [];
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };
    @ViewChild('logodropzone', {static: false}) logodropzone: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public datepipe: DatePipe,
        public ngxRolesService: NgxRolesService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private defectService: DefectService,
        private projectService: ProjectService,
        private customFieldsService: CustomFieldsService,
        private teamService: TeamService,
        private authenticationService: AuthenticationService
    ) {
        this.route.paramMap.subscribe(params => {
            this.getDefectById(params.get('id'));
        });
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    get defectControl() {
        return this.editDefectForm.controls;
    }

    ngOnInit() {
    }

    loadForms() {
        // --
        // Dates
        this.projectStartDate = new Date(this.defect.project.start_date);

        if (this.defect.start_date) {
            this.defect.start_date = new Date(this.defect.start_date);
        }

        this.editDefectForm = this.formBuilder.group({
            id: [this.defect.id],
            generated_id: [this.defect.generated_id, Validators.required],
            project_id: [this.defect.project_id, Validators.required],
            project_version: [this.defect.project_version],
            defect_name: [this.defect.defect_name, [Validators.required, Validators.maxLength(255)]],
            start_date: [this.defect.start_date],
            end_date: [this.defect.end_date],
            status: [this.defect.status, Validators.required],
            severity: [this.defect.severity, Validators.required],
            estimated_hours: [this.defect.estimated_hours, Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            assigned_group_id: [this.defect.assigned_group_id],
            assign_member: [this.defect.assign_member],
            defect_type: [this.defect.defect_type, Validators.required],
            file: [this.defect.file],
            file_extension: [this.defect.file_extension],
            attachment: [this.defect.attachment],
            description: [this.defect.description],
            custom_field: this.formBuilder.array([]),
            custom_fields: [null],
        });

        this.isPageLoaded = true;
        this.getCustomFieldByForm();

        if (!this.defect.file) {
            this.isLogoUploaded = true;
        }
    }

    loadDropzone() {
        let that = this;
        new Dropzone(this.logodropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
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
                            that.editDefectForm.patchValue({file: reader.result});
                            that.editDefectForm.patchValue({attachment: file.name});
                            that.editDefectForm.patchValue({file_extension: file.name.split('.').pop()});
                            that.isLogoLoaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.editDefectForm.patchValue({file: null});
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
        this.isLogoUploaded = true;
        this.isLogoLoaded = false;
        this.editDefectForm.patchValue({attachment_hash: null});
        this.editDefectForm.patchValue({file: null});
        this.editDefectForm.patchValue({attachment: null});
        this.editDefectForm.patchValue({file_extension: null});
    }

    getCheckPermission(defect) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            return true;
        } else if (defect.assign_member == this.loginUser.id || defect.create_user_id == this.loginUser.id) {
            return true;
        } else {
            this.router.navigate(['defects']);
        }
    }

    getProjects() {
        this.projectService.getMyProjects().subscribe(data => {
            this.projects = data;
            let selectedProject = this.projects.find(i => i.id == this.defect.project_id);
            this.projectVersion = selectedProject.project_version.split(',');
        });
    }

    getTeams() {
        this.teamService.getAll().subscribe(data => {
            this.teams = data;
            let selectedTeam = this.teams.find(i => i.id == this.defect.assigned_group_id);
            this.assignGroupChange(selectedTeam);
        });
    }

    getDefectById(defectId) {
        this.defectService.getById(defectId).subscribe(data => {
            this.defect = data;
            this.getCheckPermission(this.defect);
            this.getProjects();
            this.loadForms();
            this.getTeams();

            setTimeout(() => {
                this.loadDropzone();
            });
        });
    }

    getCustomFieldByForm() {
        this.customFieldsService.getCustomFieldByForm(3).subscribe(data => {
            this.customFields = data;
            if (this.customFields.length > 0) {
                this.addDynamicField(this.customFields);
            }
        });
    }

    addDynamicField(fieldList) {
        fieldList.forEach(element => {
            let control = <FormArray>this.editDefectForm.controls.custom_field;
            let validators = null;
            if (element.is_required == 1) {
                validators = [Validators.required];
            }
            if (element.field_type == 'date' && this.defect[element.field_column] != null) {
                control.push(
                    this.formBuilder.group({
                        [element.field_column]: [new Date(this.defect[element.field_column]), validators]
                    })
                );
            } else {
                control.push(
                    this.formBuilder.group({
                        [element.field_column]: [this.defect[element.field_column], validators]
                    })
                );
            }
        });
    }

    assignGroupChange(event: any) {
        if (this.editDefectForm.value.assigned_group_id == undefined || this.editDefectForm.value.assigned_group_id == null || this.editDefectForm.value.assigned_group_id == '') {
            this.editDefectForm.patchValue({assign_member: null});
            this.teamsMembers = null;
            return;
        }
        this.teamsMembers = event.members;
    }

    projectChange(event: any) {
        this.editDefectForm.patchValue({project_version: null});
        this.editDefectForm.patchValue({start_date: null});
        this.editDefectForm.patchValue({end_date: null});
        if (this.editDefectForm.value.project_id == undefined || this.editDefectForm.value.project_id == null || this.editDefectForm.value.project_id == '') {
            this.projectVersion = null;
            return;
        }

        this.projectVersion = event.project_version.split(',');
        // --
        // Dates
        this.projectStartDate = new Date(event.start_date);
    }

    startDateChange() {
        this.editDefectForm.patchValue({end_date: this.editDefectForm.value.start_date});
    }

    setCustomField() {
        let arr = this.editDefectForm.value.custom_field,
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
        this.editDefectForm.patchValue({custom_fields: obj});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editDefectForm.invalid) {
            return;
        }

        if (this.customFields.length > 0) {
            this.setCustomField();
        }

        this.editDefectForm.value.start_date = this.datepipe.transform(this.editDefectForm.value.start_date, 'yyyy-MM-dd');
        this.editDefectForm.value.end_date = this.datepipe.transform(this.editDefectForm.value.end_date, 'yyyy-MM-dd');

        this.defectService.update(this.editDefectForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('defects.messages.update'), this.translate.instant('defects.title'));
            this.router.navigate(['defects']);
        });
    }

}
