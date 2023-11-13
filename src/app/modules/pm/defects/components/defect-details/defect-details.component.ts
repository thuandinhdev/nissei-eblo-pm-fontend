import {Component, Input, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {DefectService} from '../../../../../core/services/defect.service';

import {defect_severity_key_value, defect_status_key_value} from './../../../../../core/helpers/pm-helper';

@Component({
    selector: 'app-defect-details',
    templateUrl: './defect-details.component.html',
    styleUrls: ['./defect-details.component.scss']
})

export class DefectDetailsComponent implements OnInit {
    @Input() defect;
    @Input() loginUser: any;
    @Input() permission;
    @Input() apiUrl;
    defectstatusKeyValue = defect_status_key_value;
    defectSeveritiesKeyValue = defect_severity_key_value;
    isDefectTab = 1;
    activeDefectTab = '1';

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private defectService: DefectService
    ) {
    }

    ngOnInit() {
    }

    setActiveDefectTab($event) {
        this.activeDefectTab = $event.id;
    }

    getActiveDefectTab(tab) {
        return this.activeDefectTab === tab;
    }

    getDefectById(defectId) {
        this.defectService.getById(defectId).subscribe(data => {
            this.defect = data;
        });
    }

    getTranslateStatus(statusKey) {
        return this.defectstatusKeyValue[statusKey];
    }

    getTranslateSeverities(statusKey) {
        return this.defectSeveritiesKeyValue[statusKey];
    }

    changeDefectStatus(defectId: any, status: any) {
        this.defectService.changeStatus({
            id: defectId,
            status: status.id
        }).subscribe(data => {
            this.toastr.success(this.translate.instant('defects.messages.status'), this.translate.instant('defects.title'));
            this.getDefectById(this.defect.id);
        });
    }

    changeDefectSeverity(defectId: any, severity: any) {
        this.defectService.changeSeverity({
            id: defectId,
            severity: severity.id
        }).subscribe(data => {
            this.toastr.success(this.translate.instant('defects.messages.severity'), this.translate.instant('defects.title'));
            this.getDefectById(this.defect.id);
        });
    }

    getParseArray(string) {
        return JSON.parse(string);
    }

    saveDefectDetail(name, value) {
        this.defect[name] = value;
        this.defectService.update(this.defect).subscribe(data => {
            this.toastr.success(this.translate.instant('defects.messages.update'), this.translate.instant('defects.title'));
            this.getDefectById(this.defect.id);
        });
    }
}
