import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';

import {TeamService} from '../../../../../core/services/team.service';
import {ProjectService} from '../../../../../core/services/project.service';
import {DefectService} from '../../../../../core/services/defect.service';
import {CustomFieldsService} from '../../../../../core/services/custom-fields.service';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-defect-create',
    templateUrl: './defect-create.component.html',
    styleUrls: ['./defect-create.component.scss'],
    preserveWhitespaces: true
})

export class DefectCreateComponent implements OnInit {
    createDefectForm: FormGroup;
    projects: any;
    projectVersion: any;
    projectStartDate: any;
    customFields: any = {length: 0};
    isFormSubmitted = false;
    isPageLoaded = false;
    clients = [];
    teams = [];
    teamsMembers = [];
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    @ViewChild('logoropzone', {static: false}) logoropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        public datepipe: DatePipe,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private defectService: DefectService,
        private projectService: ProjectService,
        private teamService: TeamService,
        private customFieldsService: CustomFieldsService,
    ) {
    }

    get defectControl() {
        return this.createDefectForm.controls;
    }

    ngOnInit() {
        this.getTeams();
        this.loadForms();
        this.getProjects();
        this.getCustomFieldByForm();
    }

    loadForms() {
        let that = this;
        this.createDefectForm = this.formBuilder.group({
            generated_id: ['DEF0001', Validators.required],
            project_id: [null, Validators.required],
            project_version: [null],
            defect_name: ['', [Validators.required, Validators.maxLength(255)]],
            start_date: [null],
            end_date: [null],
            status: [1, Validators.required],
            severity: [2, Validators.required],
            estimated_hours: ['', Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            assigned_group_id: [null],
            assign_member: [null],
            defect_type: [1, Validators.required],
            file: [''],
            file_extension: [''],
            attachment: [''],
            description: [''],
            custom_field: this.formBuilder.array([]),
            custom_fields: [null],
        });

        this.isPageLoaded = true;
        this.getDefectGeneratedId();

        setTimeout(() => {
            that.loadDropzone();
        });
    }

    loadDropzone() {
        let that = this;
        new Dropzone(this.logoropzone.nativeElement, {
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
                            that.createDefectForm.patchValue({file: reader.result});
                            that.createDefectForm.patchValue({attachment: file.name});
                            that.createDefectForm.patchValue({file_extension: file.name.split('.').pop()});
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.createDefectForm.patchValue({file: null});
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    getProjects() {
        this.projectService.getMyProjects().subscribe(data => {
            this.projects = data;
        });
    }

    projectChange(event: any) {
        this.createDefectForm.patchValue({project_version: null});
        this.createDefectForm.patchValue({start_date: null});
        this.createDefectForm.patchValue({end_date: null});
        if (this.createDefectForm.value.project_id == undefined || this.createDefectForm.value.project_id == null || this.createDefectForm.value.project_id == '') {
            this.projectVersion = null;
            return;
        }
        this.projectVersion = event.project_version.split(',');
        // --
        // Dates
        this.projectStartDate = new Date(event.start_date);
    }

    startDateChange(event: any) {
        this.createDefectForm.patchValue({end_date: event});
    }

    getTeams() {
        this.teamService.getAll().subscribe(data => {
            this.teams = data;
        });
    }

    assignGroupChange(event: any) {
        if (this.createDefectForm.value.assigned_group_id == undefined || this.createDefectForm.value.assigned_group_id == null || this.createDefectForm.value.assigned_group_id == '') {
            this.createDefectForm.patchValue({assign_member: null});
            this.teamsMembers = null;
            return;
        }
        this.teamsMembers = event.members;
    }

    getDefectGeneratedId() {
        this.defectService.getDefectGeneratedId().subscribe(data => {
            this.createDefectForm.patchValue({generated_id: data});
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
            let control = <FormArray>this.createDefectForm.controls.custom_field;
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

    setCustomFields() {
        let arr = this.createDefectForm.value.custom_field,
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
        this.createDefectForm.patchValue({custom_fields: obj});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createDefectForm.invalid) {
            return;
        }

        if (this.customFields.length > 0) {
            this.setCustomFields();
        }

        this.defectService.create(this.createDefectForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('defects.messages.create'), this.translate.instant('defects.title'));
            this.router.navigate(['defects']);
        });
    }
}
