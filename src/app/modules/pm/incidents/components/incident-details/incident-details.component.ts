import {Component, Input, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {IncidentService} from '../../../../../core/services/incident.service';

import {incident_severity_key_value, incident_status_key_value} from './../../../../../core/helpers/pm-helper';

@Component({
    selector: 'app-incident-details',
    templateUrl: './incident-details.component.html',
    styleUrls: ['./incident-details.component.scss']
})

export class IncidentDetailsComponent implements OnInit {
    @Input() incident;
    @Input() permission;
    @Input() loginUser;
    @Input() apiUrl;
    incidentstatusKeyValue = incident_status_key_value;
    incidentSeveritiesKeyValue = incident_severity_key_value;
    isPageLoaded = false;
    isIncidentTab = 1;
    activeIncidentTab = '1';

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private incidentService: IncidentService
    ) {
    }

    ngOnInit() {
        this.getIncidentById(this.incident.id);
    }

    setActiveIncidentTab($event) {
        this.isIncidentTab = $event.id;
    }

    getActiveIncidentTab(tab) {
        return this.isIncidentTab === tab;
    }

    getTranslateStatus(statusKey) {
        return this.incidentstatusKeyValue[statusKey];
    }

    getTranslatePriorities(statusKey) {
        return this.incidentSeveritiesKeyValue[statusKey];
    }

    getIncidentById(incidentId) {
        this.incidentService.getById(incidentId)
            .subscribe(
                data => {
                    this.incident = data;
                    this.isPageLoaded = true;
                });
    }

    getUsername(assignedUser) {
        return assignedUser.firstname + ' ' + assignedUser.lastname;
    }

    getParseArray(string) {
        return JSON.parse(string);
    }

    changeIncidentStatus(incidentId: any, status: any) {
        let changeIncident = {
            id: incidentId,
            status: status.id
        };
        this.incidentService.changeStatus(changeIncident)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('incidents.messages.status'), this.translate.instant('incidents.title'));
                    this.getIncidentById(this.incident.id);
                });
    }

    changeIncidentSeverity(incidentId: any, priority: any) {
        this.incidentService.changeSeverity({
            id: incidentId,
            priority: priority.id
        }).subscribe(
            data => {
                this.toastr.success(this.translate.instant('incidents.messages.priority'), this.translate.instant('incidents.title'));
                this.getIncidentById(this.incident.id);
            });
    }

    saveIncidentDetail(name, value) {
        this.incident[name] = value;
        this.incidentService.update(this.incident)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('incidents.messages.update'), this.translate.instant('incidents.title'));
                    this.getIncidentById(this.incident.id);
                });
    }
}
