import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {IncidentService} from '../../../../../core/services/incident.service';
import {ProjectService} from '../../../../../core/services/project.service';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-incident-kanban',
    templateUrl: './incident-kanban.component.html',
    styleUrls: ['./incident-kanban.component.scss']
})

export class IncidentKanbanComponent implements OnInit {
    assignedIncidents: any[];
    inprogressIncidents: any[];
    openIncidents: any[];
    completedIncidents: any[];
    projects: any;
    projectId: number;
    loginUser: any;
    filter = 'my';
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private incidentService: IncidentService,
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
                    this.getIncidents();
                });
    }

    getIncidents(projectId = null, filter = 'my') {
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
        this.incidentService.getIncidentForKanban(params).subscribe(
            data => {
                this.setIncidents(data);
            });
    }

    setIncidents(incidents) {
        this.assignedIncidents = [];
        this.inprogressIncidents = [];
        this.openIncidents = [];
        this.completedIncidents = [];

        for (let iRow in incidents) {
            switch (incidents[iRow].status) {
                case 1:
                    this.assignedIncidents.push(incidents[iRow]);
                    break;
                case 3:
                    this.inprogressIncidents.push(incidents[iRow]);
                    break;
                case 4:
                case 6:
                    this.openIncidents.push(incidents[iRow]);
                    break;
                case 2:
                case 5:
                case 7:
                    this.completedIncidents.push(incidents[iRow]);
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
            list: this.converToArray(this.assignedIncidents)
        }, {
            status: 3,
            list: this.converToArray(this.inprogressIncidents)
        }, {
            status: 4,
            list: this.converToArray(this.openIncidents)
        }, {
            status: 5,
            list: this.converToArray(this.completedIncidents)
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
        this.incidentService.updateKanbanStatusList(task)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('incidents.messages.status'), this.translate.instant('incidents.title'));
                });
    }

}
