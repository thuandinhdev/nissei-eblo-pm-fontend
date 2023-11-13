import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ProjectPlannerSprintService} from './../../../.././../core/services/project-planner-sprint.service';
import {UserService} from './../../../.././../core/services/user.service';

@Component({
    selector: 'app-create-sprint-modal',
    templateUrl: './create-sprint-modal.component.html',
    styleUrls: ['./create-sprint-modal.component.scss']
})

export class CreateSprintModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createProjectSprintForm: FormGroup;
    project: any;
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
        public bsCreateProjectSprintModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private projectPlannerSprintService: ProjectPlannerSprintService,
        private userService: UserService
    ) {
    }

    get projectSprintControl() {
        return this.createProjectSprintForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();
        this.getProjectUsers();
    }

    loadForms() {
        this.projectStartDate = new Date(this.project.start_date);
        this.projectEndDate = new Date(this.project.end_date);

        this.createProjectSprintForm = this.formBuilder.group({
            project_id: [this.project.id],
            sprint_name: ['', [Validators.required, Validators.maxLength(255)]],
            sprint_members: [null],
            start_date: [null],
            end_date: [null],
            status: [1, Validators.required],
            hours: ['', Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            description: ['']
        });
        this.isPageLoaded = true;
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
        this.createProjectSprintForm.patchValue({end_date: event});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        this.isHoursValid = false;
        if (this.createProjectSprintForm.invalid) {
            return;
        }

        if (this.createProjectSprintForm.value.hours && this.project.estimated_hours) {
            let projectHours = this.project.estimated_hours.replace(/:/g, '.'),
                sprintHours = this.createProjectSprintForm.value.hours.replace(/:/g, '.');
            if (parseInt(projectHours) < parseInt(sprintHours)) {
                this.isHoursValid = true;
                return;
            }
        }

        this.projectPlannerSprintService.create(this.createProjectSprintForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('project_planner.sprint.messages.create'), this.translate.instant('project_planner.sprint.title'));
                    this.event.emit({data});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateProjectSprintModalRef.hide();
    }
}
