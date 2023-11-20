import {Component, Input, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

import {TaskService} from '../../../../../core/services/task.service';

import {task_priority_key_value, task_status_key_value} from './../../../../../core/helpers/pm-helper';

@Component({
    selector: 'app-task-details',
    templateUrl: './task-details.component.html',
    styleUrls: ['./task-details.component.scss']
})

export class TaskDetailsComponent implements OnInit {
    @Input() task: any;
    @Input() loginUser: any;
    @Input() permission: boolean;
    @Input() apiUrl;
    taskstatusKeyValue = task_status_key_value;
    taskPriorityKeyValue = task_priority_key_value;
    knOptions = {
        readOnly: true,
        size: 150,
        unit: '%',
        textColor: '#000000',
        fontSize: '32',
        valueformat: 'percent',
        value: 0,
        max: 100,
        trackWidth: 19,
        barWidth: 20,
        trackColor: '#D8D8D8',
        barColor: '#FF6F17'
    };

    constructor(
        public ngxRolesService: NgxRolesService,
        public translate: TranslateService,
        private taskService: TaskService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
    }

    getTaskById(taskId) {
        this.taskService.getById(taskId)
            .subscribe(
                data => {
                    this.task = data;
                });
    }

    getTaskStatus(status) {
        return 'tasks.status' + status;
    }

    getTranslateStatus(statusKey) {
        return this.taskstatusKeyValue[statusKey];
    }

    getTranslatePriorities(priorityKey) {
        return this.taskPriorityKeyValue[priorityKey];
    }

    changeTaskPriority(taskId: any, priority: any) {
        this.taskService.changePriority({id: taskId, priority: priority.id}).subscribe(data => {
            this.toastr.success(this.translate.instant('tasks.messages.priority'), this.translate.instant('tasks.title'));
            this.getTaskById(this.task.id);
        });
    }

    changeTaskStatus(taskID: any, status: any) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmText'),
            cancelButtonText: this.translate.instant('common.swal.cancel')
        }).then((result) => {
            if (result.value) {
                this.task.status = status.id
                let changeTask = {
                    id: taskID,
                    status: status.id
                };
                this.taskService.changeStatus(changeTask).subscribe(data => {
                    this.toastr.success(this.translate.instant('tasks.messages.status'), this.translate.instant('tasks.title'));
                    this.getTaskById(this.task.id);
                });
            }
        });
    }
    // changeTaskStatus(taskID: any, status: any) {
    //     let changeTask = {
    //         id: taskID,
    //         status: status.id
    //     };
    //     this.taskService.changeStatus(changeTask).subscribe(data => {
    //         this.toastr.success(this.translate.instant('tasks.messages.status'), this.translate.instant('tasks.title'));
    //         this.getTaskById(this.task.id);
    //     });
    // }

    getParseArray(string) {
        return JSON.parse(string);
    }

    saveTaskDetail(name, value) {
        this.task[name] = value;
        this.taskService.update(this.task)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('tasks.messages.update'), this.translate.instant('tasks.title'));
                    this.getTaskById(this.task.id);
                });
    }

    saveSubTaskDetail(subTask, name, value) {
        subTask[name] = value;
        this.taskService.update(subTask).subscribe(data => {
            this.toastr.success(this.translate.instant('tasks.messages.update'), this.translate.instant('tasks.title'));
            this.getTaskById(this.task.id);
        });
    }

    getCheckPermission(sub_task) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            return true;
        } else if (sub_task.assign_to == this.loginUser.id || sub_task.created_by == this.loginUser.id) {
            return true;
        } else {
            return false;
        }
    }

    deleteSubTask(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.taskService.delete(id).subscribe(data => {
                    this.toastr.success(this.translate.instant('tasks.messages.delete'), this.translate.instant('tasks.title'));
                    this.getTaskById(this.task.id);
                });
            }
        });
    }
}
