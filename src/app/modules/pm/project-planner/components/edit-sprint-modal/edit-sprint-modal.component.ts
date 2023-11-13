import {Component, EventEmitter, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ProjectPlannerSprintService} from './../../../.././../core/services/project-planner-sprint.service';

@Component({
    selector: 'app-edit-sprint-modal',
    templateUrl: './edit-sprint-modal.component.html',
    styleUrls: ['./edit-sprint-modal.component.scss']
})

export class EditSprintModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editProjectSprintForm: FormGroup;
    project: any;
    sprint: any;
    sprintId: any;
    projectStartDate: Date;
    projectEndDate: Date;
    isFormSubmitted = false;
    isPageLoaded = false;
    isHoursValid = false;
    users = [];
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public bsEditProjectSprintModalRef: BsModalRef,
        public datepipe: DatePipe,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private projectPlannerSprintService: ProjectPlannerSprintService
    ) {
    }

    get projectSprintControl() {
        return this.editProjectSprintForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getProjectSprintById(this.sprintId);
    }

    loadForms() {
        this.projectStartDate = new Date(this.project.start_date);
        this.projectEndDate = new Date(this.project.end_date);
        this.setDateFormat();
        this.editProjectSprintForm = this.formBuilder.group({
            id: [this.sprint.id],
            project_id: [this.sprint.project_id],
            sprint_name: [this.sprint.sprint_name, [Validators.required, Validators.maxLength(255)]],
            sprint_members: [this.sprint.sprint_members],
            start_date: [this.sprint.start_date],
            end_date: [this.sprint.end_date],
            status: [this.sprint.status, Validators.required],
            hours: [this.sprint.hours, Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            description: [this.sprint.description]
        });

        this.getProjectUsers();
        this.isPageLoaded = true;
    }

    setDateFormat() {
        if (this.sprint.start_date) {
            this.sprint.start_date = new Date(this.sprint.start_date);
        }
        if (this.sprint.end_date) {
            this.sprint.end_date = new Date(this.sprint.end_date);
        }
    }

    getProjectUsers() {
        if (this.project.assign_members == 'Unassign' || this.project.assign_members == null) {
        } else {
            let userArr = this.project.assign_members.split(',');
            for (let iRow in userArr) {
                for (let jRow in this.project.users) {
                    if (this.project.users[jRow].id == userArr[iRow]) {
                        this.users.push(this.project.users[jRow]);
                    }
                }
            }
        }
    }

    startDateChange(event: any) {
        this.editProjectSprintForm.patchValue({end_date: this.editProjectSprintForm.value.start_date});
    }

    getProjectSprintById(sprintID) {
        this.projectPlannerSprintService.getProjectSprintById(sprintID)
            .subscribe(data => {
                this.sprint = data;
                this.loadForms();
            });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        this.isHoursValid = false;
        if (this.editProjectSprintForm.invalid) {
            return;
        }

        // --
        // Hours validation
        if (this.editProjectSprintForm.value.hours && this.project.estimated_hours) {
            let projectHours = this.project.estimated_hours.replace(/:/g, '.'),
                sprintHours = this.editProjectSprintForm.value.hours.replace(/:/g, '.');
            if (parseInt(projectHours) < parseInt(sprintHours)) {
                this.isHoursValid = true;
                return;
            }
        }

        // --
        // Date format
        this.editProjectSprintForm.value.start_date = this.datepipe.transform(this.editProjectSprintForm.value.start_date, 'yyyy-MM-dd');
        this.editProjectSprintForm.value.end_date = this.datepipe.transform(this.editProjectSprintForm.value.end_date, 'yyyy-MM-dd');
        this.projectPlannerSprintService.update(this.editProjectSprintForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('project_planner.sprint.messages.update'), this.translate.instant('project_planner.sprint.title'));
            this.editProjectSprintForm.patchValue({sprint_members: this.editProjectSprintForm.value.sprint});
            this.event.emit({data});
            this.onCancel();
        });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditProjectSprintModalRef.hide();
    }
}
