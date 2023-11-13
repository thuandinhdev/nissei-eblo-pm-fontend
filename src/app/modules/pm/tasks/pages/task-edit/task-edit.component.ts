import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';
import {TranslateService} from '@ngx-translate/core';
import {Options} from 'ng5-slider';

import {CustomFieldsService} from '../../../../../core/services/custom-fields.service';
import {TaskService} from '../../../../../core/services/task.service';
import {ProjectService} from '../../../../../core/services/project.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

@Component({
    selector: 'app-task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.scss'],
    preserveWhitespaces: true
})

export class TaskEditComponent implements OnInit {
    editTaskForm: FormGroup;
    loginUser: any;
    parentTask: any;
    task: any;
    projects: any;
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
        public ngxRolesService: NgxRolesService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private taskService: TaskService,
        private projectService: ProjectService,
        private customFieldsService: CustomFieldsService,
        private authenticationService: AuthenticationService
    ) {
        this.route.paramMap.subscribe(params => {
            this.getTaskById(params.get('id'));
        });
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    get taskControl() {
        return this.editTaskForm.controls;
    }

    ngOnInit() {
        this.getProjects();
    }

    loadForms() {
        this.editTaskForm = this.formBuilder.group({
            id: [this.task.id],
            parent_task_id: [this.task.parent_task_id],
            name: [this.task.name, Validators.required],
            generated_id: [this.task.generated_id, [Validators.required]],
            project_id: [this.task.project_id, Validators.required],
            project_version: [this.task.project_version],
            planned_start_date: [this.task.planned_start_date],
            planned_end_date: [this.task.planned_end_date],
            task_start_date: [this.task.task_start_date],
            task_end_date: [this.task.task_end_date],
            assign_to: [this.task.assign_to],
            status: [this.task.status, Validators.required],
            priority: [this.task.priority, Validators.required],
            estimated_hours: [this.task.estimated_hours, Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            progress: [parseInt(this.task.progress)],
            description: [this.task.description],
            users: [],
            custom_field: this.formBuilder.array([]),
            custom_fields: [null],
        });

        // --
        // Project Version
        this.projectVersions = this.task.project1.project_version.split(',');
        // --
        // Project users
        this.users = this.task.project1.users;
        for (let i = 0; i < this.users.length; i++) {
            this.userIds.push({'id': this.users[i].id});
        }
        this.editTaskForm.patchValue({users: this.userIds});

        // --
        // Custom fields
        this.getCustomFieldByForm();

        // --
        // Parent task dates
        if (this.task.parent_task_id != 0) {
            this.getParentTask(this.task.parent_task_id);
        } else {
            this.isPageLoaded = true;
        }
    }

    loadSubtaskForm(parentTask) {
        this.parentTask = parentTask;
        this.isPageLoaded = true;
    }

    getTaskStatus(status) {
        return 'tasks.status' + status;
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

    addDynamicField(fieldList) {
        fieldList.forEach(element => {
            let control = <FormArray>this.editTaskForm.controls.custom_field;
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

    getCheckPermission(task) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
        } else if (task.assign_to == this.loginUser.id || task.created_by == this.loginUser.id) {
        } else {
            this.router.navigate(['tasks']);
        }
    }

    getProjects() {
        this.projectService.getProject().subscribe(data => {
            this.projects = data;
        });
    }

    getTaskById(taskId) {
        this.taskService.getById(taskId)
            .subscribe(
                data => {
                    this.task = data;
                    this.getCheckPermission(this.task);
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

    getParentTask(parentTaskId) {
        this.taskService.getParentTask(parentTaskId)
            .subscribe(
                data => {
                    this.loadSubtaskForm(data);
                });
    }

    setCustomFields() {
        let arr = this.editTaskForm.value.custom_field;
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
        this.editTaskForm.patchValue({custom_fields: obj});
    }

    projectChange(event: any) {
        this.userIds = [];
        this.editTaskForm.patchValue({project_version: null});
        this.editTaskForm.patchValue({assign_to: null});
        this.editTaskForm.patchValue({planned_start_date: null});
        this.editTaskForm.patchValue({planned_end_date: null});
        this.editTaskForm.patchValue({task_start_date: null});
        this.editTaskForm.patchValue({task_end_date: null});

        if (this.editTaskForm.value.project_id == undefined || this.editTaskForm.value.project_id == null || this.editTaskForm.value.project_id == '') {
            this.projectVersions = null;
            this.users = null;
            return;
        }

        this.projectVersions = event.project_version.split(',');

        // --
        // Project users
        this.users = event.users;
        for (let i = 0; i < this.users.length; i++) {
            this.userIds.push({'id': this.users[i].id});
        }
        this.editTaskForm.patchValue({users: this.userIds});
    }

    clearVersionValues() {
        this.editTaskForm.patchValue({project_version: null});
    }

    planstartDateChange(event: any) {
        this.editTaskForm.patchValue({planned_end_date: this.editTaskForm.value.planned_start_date});
    }

    taskstartDateChange(event: any) {
        this.editTaskForm.patchValue({task_end_date: this.editTaskForm.value.task_start_date});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        this.isHoursValid = false;
        if (this.editTaskForm.invalid) {
            return;
        }

        // --
        // Hours validation
        if (this.editTaskForm.value.estimated_hours && this.task.project1.estimated_hours) {
            let projectHours = this.task.project1.estimated_hours.replace(/:/g, '.'),
                taskHours = this.editTaskForm.value.estimated_hours.replace(/:/g, '.');
            if (parseInt(projectHours) < parseInt(taskHours)) {
                this.isHoursValid = true;
                return;
            }
        }

        if (this.customFields.length > 0) {
            this.setCustomFields();
        }

        this.editTaskForm.value.planned_start_date = this.datepipe.transform(this.editTaskForm.value.planned_start_date, 'yyyy-MM-dd');
        this.editTaskForm.value.planned_end_date = this.datepipe.transform(this.editTaskForm.value.planned_end_date, 'yyyy-MM-dd');
        this.editTaskForm.value.task_start_date = this.datepipe.transform(this.editTaskForm.value.task_start_date, 'yyyy-MM-dd');
        this.editTaskForm.value.task_end_date = this.datepipe.transform(this.editTaskForm.value.task_end_date, 'yyyy-MM-dd');

        this.taskService.update(this.editTaskForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('tasks.messages.update'), this.translate.instant('tasks.title'));
            this.router.navigate(['tasks']);
        });
    }

}
