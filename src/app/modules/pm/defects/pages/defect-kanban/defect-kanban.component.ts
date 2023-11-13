import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {DefectService} from '../../../../../core/services/defect.service';
import {ProjectService} from '../../../../../core/services/project.service';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-defect-kanban',
    templateUrl: './defect-kanban.component.html',
    styleUrls: ['./defect-kanban.component.scss']
})

export class DefectKanbanComponent implements OnInit {
    openDefects: any[];
    assignedDefects: any[];
    inprogressDefects: any[];
    completedDefects: any[];
    projects: any;
    projectId: number;
    loginUser: any;
    filter = 'my';
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private defectService: DefectService,
        private projectService: ProjectService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.getProjects();
    }

    getProjects() {
        this.projectService.getMyProjects()
            .subscribe(
                data => {
                    this.projects = data;
                    this.getDefects();
                });
    }

    getDefects(projectId = null, filter = 'my') {
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

        this.projectId = projectId;
        this.defectService.getDefectForKanban(params).subscribe(
            data => {
                this.setDefects(data);
            });
    }

    setDefects(defects) {
        this.assignedDefects = [];
        this.inprogressDefects = [];
        this.openDefects = [];
        this.completedDefects = [];

        for (let iRow in defects) {
            switch (defects[iRow].status) {
                case 1:
                    this.assignedDefects.push(defects[iRow]);
                    break;
                case 3:
                    this.inprogressDefects.push(defects[iRow]);
                    break;
                case 4:
                case 6:
                    this.openDefects.push(defects[iRow]);
                    break;
                case 2:
                case 7:
                case 5:
                    this.completedDefects.push(defects[iRow]);
                    break;
                default:
                    break;
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
            list: this.converToArray(this.assignedDefects)
        }, {
            status: 3,
            list: this.converToArray(this.inprogressDefects)
        }, {
            status: 4,
            list: this.converToArray(this.openDefects)
        }, {
            status: 5,
            list: this.converToArray(this.completedDefects)
        }];

        this.updateStatusList(statusTask);
    }

    converToArray(list) {
        let status_list = [];
        list.forEach(element => {
            status_list.push(parseInt(element.id));
        });

        return status_list;
    }

    updateStatusList(task) {
        this.defectService.updateKanbanStatusList(task)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('defects.messages.status'), this.translate.instant('defects.title'));
                });
    }
}
