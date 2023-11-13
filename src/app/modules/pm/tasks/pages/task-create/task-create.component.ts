import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Options} from 'ng5-slider';

import {TaskService} from '../../../../../core/services/task.service';
import {CustomFieldsService} from '../../../../../core/services/custom-fields.service';
import {ProjectService} from '../../../../../core/services/project.service';

@Component({
    selector: 'app-task-create',
    templateUrl: './task-create.component.html',
    styleUrls: ['./task-create.component.scss'],
    preserveWhitespaces: true
})

export class TaskCreateComponent implements OnInit {
    createTaskForm: FormGroup;
    parentTask: any;
    projects: any;
    project: any;
    customFields: any = {length: 0};
    isFormSubmitted = false;
    isPageLoaded = false;
    isHoursValid = false;
    projectVersions = [];
    users = [];
    userIds = [];
    parent_task_id = this.route.snapshot.params.id;
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
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private taskService: TaskService,
        private projectService: ProjectService,
        private customFieldsService: CustomFieldsService,
        public datepipe: DatePipe
    ) {
    }

    get taskControl() {
        return this.createTaskForm.controls;
    }

    ngOnInit() {
        if (this.parent_task_id == '' || this.parent_task_id == null) {
            this.parent_task_id = 0;
        }

        this.getProjects();
    }

    loadForms(parentTaskId) {
        if (parentTaskId == 0) {
            this.createTaskForm = this.formBuilder.group({
                parent_task_id: [parentTaskId],
                name: ['', [Validators.required, Validators.maxLength(255)]],
                generated_id: ['T0001', Validators.required],
                project_id: [null, Validators.required],
                project_version: [null],
                planned_start_date: [null],
                planned_end_date: [null],
                task_start_date: [null],
                task_end_date: [null],
                assign_to: [null],
                status: [1, Validators.required],
                priority: [4, Validators.required],
                estimated_hours: ['', Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
                progress: [0],
                description: [''],
                users: [],
                custom_field: this.formBuilder.array([]),
                custom_fields: [null],
            });

            this.getGeneratedId();
            this.getCustomFieldByForm();
            this.isPageLoaded = true;
        } else {
            this.getParentTask(this.parent_task_id);
        }
    }

    loadSubtaskForm(parentTask) {
        this.parentTask = parentTask;
        this.project = this.parentTask.project1;

        // --
        // Project users
        this.users = this.project.users;
        for (let i = 0; i < this.users.length; i++) {
            this.userIds.push(this.users[i].id);
        }

        this.createTaskForm = this.formBuilder.group({
            parent_task_id: [parentTask.id],
            name: ['', [Validators.required, Validators.maxLength(255)]],
            generated_id: ['', Validators.required],
            project_id: [this.project.id],
            project_version: [this.project.project_version],
            planned_start_date: [null],
            planned_end_date: [null],
            task_start_date: [null],
            task_end_date: [null],
            assign_to: [null],
            status: [parentTask.status, Validators.required],
            priority: [4, Validators.required],
            estimated_hours: ['', Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            progress: [0],
            description: [''],
            users: [this.userIds],
            custom_field: this.formBuilder.array([]),
            custom_fields: [null],
        });

        this.getSubTaskGeneratedId(parentTask.id);
        this.getCustomFieldByForm();
        this.isPageLoaded = true;
    }

    getCustomFieldByForm() {
        this.customFieldsService.getCustomFieldByForm(2)
            .subscribe(
                data => {
                    this.customFields = data;
                    if (this.customFields.length > 0) {
                        this.addDynamicField(this.customFields);
                    }
                });
    }

    getTaskStatus() {
        if (this.parent_task_id == 0) {
            return 'tasks.status';
        } else {
            return 'tasks.parent_status' + this.parentTask.status;
        }
    }

    getProjects() {
        this.projectService.getProject()
            .subscribe(
                data => {
                    this.projects = data;
                    this.loadForms(this.parent_task_id);
                });
    }

    getGeneratedId() {
        this.taskService.getGeneratedId().subscribe(data => {
            this.createTaskForm.patchValue({generated_id: data});
        });
    }

    getSubTaskGeneratedId(parentTaskId) {
        this.taskService.getsubTaskCountByParent(parentTaskId).subscribe(data => {
            this.createTaskForm.patchValue({generated_id: this.parentTask.generated_id + '.' + data});
        });
    }

    getParentTask(parentTaskId) {
        this.taskService.getParentTask(parentTaskId)
            .subscribe(
                data => {
                    this.loadSubtaskForm(data);
                });
    }

    projectChange(event: any) {
        this.userIds = [];
        this.createTaskForm.patchValue({project_version: null});
        this.createTaskForm.patchValue({assign_to: null});
        this.createTaskForm.patchValue({planned_start_date: null});
        this.createTaskForm.patchValue({planned_end_date: null});
        this.createTaskForm.patchValue({task_start_date: null});
        this.createTaskForm.patchValue({task_end_date: null});

        if (this.createTaskForm.value.project_id == undefined || this.createTaskForm.value.project_id == null || this.createTaskForm.value.project_id == '') {
            this.projectVersions = null;
            this.users = null;
            return;
        }

        // --
        // Project version
        this.projectVersions = event.project_version.split(',');

        // --
        // Project users
        this.users = event.users;
        for (let i = 0; i < this.users.length; i++) {
            this.userIds.push(this.users[i].id);
        }
        this.createTaskForm.patchValue({users: this.userIds});

        this.project = event;
    }

    addDynamicField(fieldList) {
        fieldList.forEach(element => {
            let control = <FormArray>this.createTaskForm.controls.custom_field;
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
        let arr = this.createTaskForm.value.custom_field,
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
        this.createTaskForm.patchValue({custom_fields: obj});
    }

    planstartDateChange(event: any) {
        this.createTaskForm.patchValue({planned_end_date: event});
    }

    taskstartDateChange(event: any) {
        this.createTaskForm.patchValue({task_end_date: event});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        this.isHoursValid = false;
        if (this.createTaskForm.invalid) {
            return;
        }

        // --
        // Hours validation
        if (this.createTaskForm.value.estimated_hours && this.project.estimated_hours) {
            let projectHours = this.project.estimated_hours.replace(/:/g, '.'),
                taskHours = this.createTaskForm.value.estimated_hours.replace(/:/g, '.');
            if (parseInt(projectHours) < parseInt(taskHours)) {
                this.isHoursValid = true;
                return;
            }
        }

        if (this.customFields.length > 0) {
            this.setCustomFields();
        }

        this.createTaskForm.value.planned_start_date = this.datepipe.transform(this.createTaskForm.value.planned_start_date, 'yyyy-MM-dd');
        this.createTaskForm.value.planned_end_date = this.datepipe.transform(this.createTaskForm.value.planned_end_date, 'yyyy-MM-dd');
        this.createTaskForm.value.task_start_date = this.datepipe.transform(this.createTaskForm.value.task_start_date, 'yyyy-MM-dd');
        this.createTaskForm.value.task_end_date = this.datepipe.transform(this.createTaskForm.value.task_end_date, 'yyyy-MM-dd');

        this.taskService.create(this.createTaskForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('tasks.messages.create'), this.translate.instant('tasks.title'));
                    this.router.navigate(['tasks']);
                });
    }
}
