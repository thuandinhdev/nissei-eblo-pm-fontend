import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Options} from 'ng5-slider';

import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {ProjectService} from '../../../../../core/services/project.service';
import {TaskService} from '../../../../../core/services/task.service';
import {CustomFieldsService} from '../../../../../core/services/custom-fields.service';
import {DefectService} from '../../../../../core/services/defect.service';


@Component({
    selector: 'app-task-copy',
    templateUrl: './task-copy.component.html',
    styleUrls: ['./task-copy.component.scss']
})

export class TaskCopyComponent implements OnInit {
    copyTaskForm: FormGroup;
    loginUser: any;
    projects: any;
    task: any;
    projectUser: any;
    customFields: any = {length: 0};
    isFormSubmitted = false;
    isPageLoaded = false;
    isHoursValid = false;
    users = [];
    userIds = [];
    projectVersions = [];
    progressOptions: Options = {
        floor: 0,
        ceil: 100
    };
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public datepipe: DatePipe,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private projectService: ProjectService,
        private taskService: TaskService,
        private defectService: DefectService,
        private customFieldsService: CustomFieldsService,
        private authenticationService: AuthenticationService
    ) {
        this.route.paramMap.subscribe(params => {
            this.getTaskById(params.get('id'));
        });
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    get taskControl() {
        return this.copyTaskForm.controls;
    }

    ngOnInit() {
        this.getProjects();
    }

    // getTaskById(taskId) {
    //     this.taskService.getById(taskId).subscribe(data => {
    //         this.task = data;
    //         this.setDateFormat();
    //         this.loadForms();
    //     });

    // }
    getTaskById(defectId) {
        this.defectService.getById(defectId).subscribe(data => {
            this.task = data;
            this.setDateFormat();
            this.loadForms();
        });
    }

    setDateFormat() {
        if (this.task.planned_start_date) {
            this.task.planned_start_date = new Date(this.task.planned_start_date);
        }
        if (this.task.planned_end_date) {
            this.task.planned_end_date = new Date(this.task.planned_end_date);
        }
        if (this.task.task_start_date) {
            this.task.task_start_date = new Date(this.task.task_start_date);
        }
        if (this.task.task_end_date) {
            this.task.task_end_date = new Date(this.task.task_end_date);
        }
    }

    loadForms() {
        // Project users
        // this.users = this.task.project1.users;
        // for (let i = 0; i < this.users.length; i++) {
        //     this.userIds.push(this.users[i].id);
        // }

        // Project Version
        // this.projectVersions = this.task.project1.project_version.split(',');

        this.copyTaskForm = this.formBuilder.group({
            name: [this.task.defect_name, Validators.required],
            generated_id: ['T0...', [Validators.required]],
            project_id: [this.task.project_id, Validators.required],
            project_version: [this.task.project_version],
            planned_start_date: [null],
            planned_end_date: [null],
            task_start_date: [null],
            task_end_date: [null],
            assign_to: [null],
            status: [1, Validators.required],
            priority: [1, Validators.required],
            estimated_hours: ['', Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            progress: [0],
            description: [this.task.description],
            notes: [this.task.notes],
            defect_id: [this.task.id],
            users: [null],
            custom_field: this.formBuilder.array([]),
            custom_fields: [null],
        });

        this.getGeneratedId();
        this.getCustomFieldByForm();
        this.isPageLoaded = true;
    }

    getGeneratedId() {
        this.taskService.getGeneratedId().subscribe(data => {
            this.copyTaskForm.patchValue({generated_id: data});
        });
    }

    getCustomFieldByForm() {
        this.customFieldsService.getCustomFieldByForm(2).subscribe(data => {
            this.customFields = data;
            if (this.customFields.length > 0) {
                this.addDynamicField(this.customFields);
            }
        });
    }

    addDynamicField(fieldList) {
        fieldList.forEach(element => {
            let control = <FormArray>this.copyTaskForm.controls.custom_field;
            let validators = null;
            if (element.is_required == 1) {
                validators = [Validators.required];
            }
            if (element.field_type == 'date' && this.task[element.field_column] != null) {
                control.push(
                    this.formBuilder.group({
                        [element.field_column]: [new Date(this.task[element.field_column]), validators]
                    })
                );
            } else {
                control.push(
                    this.formBuilder.group({
                        [element.field_column]: [this.task[element.field_column], validators]
                    })
                );
            }
        });
    }

    getTaskStatus(status) {
        return 'tasks.status' + status;
    }

    getProjects() {
        this.projectService.getProject().subscribe(data => {
            this.projects = data;
            this.users = data[0].users;
        });
    }

    projectChange(event: any) {
        this.userIds = [];
        this.copyTaskForm.patchValue({project_version: null});
        this.copyTaskForm.patchValue({assign_to: null});
        this.copyTaskForm.patchValue({planned_start_date: null});
        this.copyTaskForm.patchValue({planned_end_date: null});
        this.copyTaskForm.patchValue({task_start_date: null});
        this.copyTaskForm.patchValue({task_end_date: null});

        if (this.copyTaskForm.value.project_id == undefined || this.copyTaskForm.value.project_id == null || this.copyTaskForm.value.project_id == '') {
            this.projectVersions = null;
            this.users = null;
            return;
        }

        this.projectVersions = event.project_version.split(',');

        // Project users
        this.users = event.users;
        for (let i = 0; i < this.users.length; i++) {
            this.userIds.push(this.users[i].id);
        }
        this.copyTaskForm.patchValue({users: this.userIds});
    }

    clearVersionValues() {
        this.copyTaskForm.patchValue({project_version: null});
    }

    planstartDateChange(event: any) {
        this.copyTaskForm.patchValue({planned_end_date: this.copyTaskForm.value.planned_start_date});
    }

    taskstartDateChange(event: any) {
        this.copyTaskForm.patchValue({task_end_date: this.copyTaskForm.value.task_start_date});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        this.isHoursValid = false;
        if (this.copyTaskForm.invalid) {
            return;
        }

        // Hours validation
        if (this.copyTaskForm.value.estimated_hours && this.task.project1.estimated_hours) {
            let projectHours = this.task.project1.estimated_hours.replace(/:/g, '.'),
                taskHours = this.copyTaskForm.value.estimated_hours.replace(/:/g, '.');
            if (parseInt(projectHours) < parseInt(taskHours)) {
                this.isHoursValid = true;
                return;
            }
        }

        if (this.customFields.length > 0) {
            this.setCustomFields();
        }

        this.copyTaskForm.value.planned_start_date = this.datepipe.transform(this.copyTaskForm.value.planned_start_date, 'yyyy-MM-dd');
        this.copyTaskForm.value.planned_end_date = this.datepipe.transform(this.copyTaskForm.value.planned_end_date, 'yyyy-MM-dd');
        this.copyTaskForm.value.task_start_date = this.datepipe.transform(this.copyTaskForm.value.task_start_date, 'yyyy-MM-dd');
        this.copyTaskForm.value.task_end_date = this.datepipe.transform(this.copyTaskForm.value.task_end_date, 'yyyy-MM-dd');
        this.taskService.copyDefectToTask(this.copyTaskForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('tasks.messages.copy'), this.translate.instant('tasks.title'));
            this.router.navigate(['tasks']);
        });
    }

    setCustomFields() {
        let arr = this.copyTaskForm.value.custom_field;
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
        this.copyTaskForm.patchValue({custom_fields: obj});
    }

}
