import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxRolesService} from 'ngx-permissions';

import {TaskService} from '../../../../../core/services/task.service';
import {AuthenticationService} from 'src/app/core/services/authentication.service';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss']
})

export class TaskDetailComponent implements OnInit {
    task: any;
    loginUser: any;
    isPageLoaded = false;
    permission = false;
    private apiUrl = environment.apiUrl;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public ngxRolesService: NgxRolesService,
        private taskService: TaskService,
        private authenticationService: AuthenticationService
    ) {
        this.route.paramMap.subscribe(params => {
            this.getById(params.get('id'));
        });
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
    }

    getCheckPermission(task) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            this.permission = true;
        } else if (task.assign_to == this.loginUser.id || task.created_by == this.loginUser.id) {
            this.permission = true;
        }
    }

    getById(taskId) {
        this.taskService.getById(taskId).subscribe(data => {
            this.task = data;
            this.getCheckPermission(this.task);
            this.isPageLoaded = true;
        });
    }
}
