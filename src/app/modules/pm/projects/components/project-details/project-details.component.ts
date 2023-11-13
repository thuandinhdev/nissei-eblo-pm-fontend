import {Component, Input, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {ProjectService} from '../../../../../core/services/project.service';
import {ClientService} from '../../../../../core/services/client.service';

import {project_status_key_value} from './../../../../../core/helpers/pm-helper';

@Component({
    selector: 'app-project-details',
    templateUrl: './project-details.component.html',
    styleUrls: ['./project-details.component.scss']
})

export class ProjectDetailsComponent implements OnInit {
    @Input() project: any;
    @Input() loginUser: any;
    @Input() permissions: any;
    @Input() apiUrl;
    projectSourceKeyValue = [];
    clients = [];
    projectstatusKeyValue = project_status_key_value;
    datepickerConfigs = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        private projectService: ProjectService,
        private clientService: ClientService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
        if (!this.loginUser.is_client) {
            this.getClient();
        }
    }

    getClient() {
        let that = this;
        that.clientService.getClientsWithTrashed().subscribe(data => {
                for (let iRow in data) {
                    that.clients.push({
                        label: data[iRow].firstname + ' ' + data[iRow].lastname,
                        value: data[iRow].id
                    });
                }
            }
        );
    }

    changeProjectStatus(projectIDs: any, status: any) {
        let changeProject = {
            ids: projectIDs,
            status: status.id
        };
        this.projectService.changeStatus(changeProject)
            .subscribe(
                data => {
                    this.getProjectById(this.project.id);
                    this.toastr.success(this.translate.instant('projects.messages.status'), this.translate.instant('projects.title'));
                });
    }

    getParseArray(string) {
        return JSON.parse(string);
    }

    saveProjectDetail(name, value) {
        this.project[name] = value;
        if (name == 'start_date' && this.project.end_date < this.project.start_date) {
            this.project.end_date = new Date(value);
        }
        this.projectService.update(this.project)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('projects.messages.update'), this.translate.instant('projects.title'));
                    this.getProjectById(this.project.id);
                });
    }

    getProjectById(projectId) {
        this.projectService.getById(projectId)
            .subscribe(
                data => {
                    this.project = data;
                });
    }

    getTranslateStatus(statusKey) {
        return this.projectstatusKeyValue[statusKey];
    }
}
