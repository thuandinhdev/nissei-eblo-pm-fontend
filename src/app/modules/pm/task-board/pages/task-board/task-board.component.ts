import {Component, OnInit} from '@angular/core';
import {NgxRolesService} from 'ngx-permissions';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {AuthenticationService} from 'src/app/core/services/authentication.service';
import {TaskService} from '../../../../../core/services/task.service';
import {ProjectService} from '../../../../../core/services/project.service';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-task-board',
    templateUrl: './task-board.component.html',
    styleUrls: ['./task-board.component.scss']
})

export class TaskBoardComponent implements OnInit {
    openTasks: any[];
    inprogressTasks: any[];
    completedTasks: any[];
    tasks: any;
    projects: any;
    loginUser: any;
    data: any;
    project_id: number;
    filter = 'my';
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private toastr: ToastrService,
        private taskService: TaskService,
        private projectService: ProjectService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.getProjects();
    }

    getCheckPermission(task) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            return true;
        } else if (task.assign_to == this.loginUser.id || task.created_by == this.loginUser.id) {
            return true;
        } else {
            return false;
        }
    }

    getProjects() {
        this.projectService.getMyProjects().subscribe(data => {
            this.projects = data;
            this.getTaskForTaskBoard();
        });
    }

    getTasks(project) {
        if (project) {
            this.getTaskForTaskBoard(project.id);
        }
    }

    getTaskForTaskBoard(projectId = null, filter = 'my') {
        let params = {};
        if (projectId == null) {
            params = {
                'filter': filter
            };
        } else {
            params = {
                'project_id': projectId,
                'filter': filter
            };
        }

        this.project_id = projectId;
        this.filter = filter;
        this.openTasks = [];
        this.inprogressTasks = [];
        this.completedTasks = [];
        this.taskService.getTaskForTaskBoard(params).subscribe(data => {
            this.tasks = data;
            this.setTasks();
        });
    }

    setTasks() {
        if (this.tasks) {
            for (let iRow in this.tasks) {
                if (this.tasks[iRow].status == 1) {
                    this.openTasks.push(this.tasks[iRow]);
                }
                if (this.tasks[iRow].status == 2 || this.tasks[iRow].status == 3 || this.tasks[iRow].status == 4) {
                    this.inprogressTasks.push(this.tasks[iRow]);
                }
                if (this.tasks[iRow].status == 6 || this.tasks[iRow].status == 5) {
                    this.completedTasks.push(this.tasks[iRow]);
                }
            }
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }

        let statusTask = [{
            status: 1,
            list: this.converToArray(this.openTasks)
        },
            {
                status: 2,
                list: this.converToArray(this.inprogressTasks)
            },
            {
                status: 6,
                list: this.converToArray(this.completedTasks)
            }];

        this.updateStatusList(statusTask);
    }

    updateStatusList(task) {
        // if(this.getCheckPermission(task)) {

        // } else {
        // 	this.toastr.error(this.translate.instant('common.error_messages.message1'), this.translate.instant('common.errors_keys.key1'));
        // }

        this.taskService.updateStatusList(task).subscribe(data => {
            this.toastr.success(this.translate.instant('tasks.messages.status'), this.translate.instant('tasks.title'));
            this.getTaskForTaskBoard(this.project_id, this.filter);
        });
    }

    converToArray(list) {
        let status_list = [];
        list.forEach(element => {
            status_list.push(parseInt(element.id));
        });

        return status_list;
    }
}
