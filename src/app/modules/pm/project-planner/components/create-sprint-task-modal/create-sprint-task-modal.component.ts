import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ProjectPlannerSprintService} from './../../../.././../core/services/project-planner-sprint.service';

@Component({
    selector: 'app-create-sprint-task-modal',
    templateUrl: './create-sprint-task-modal.component.html',
    styleUrls: ['./create-sprint-task-modal.component.scss']
})
export class CreateSprintTaskModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createProjectSprintTaskForm: FormGroup;
    sprint: any;
    sprintStartDate: Date;
    sprintEndDate: Date;
    isFormSubmitted = false;
    isPageLoaded = false;
    isHoursValid = false;
    users = [];
    statusLists = [];
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public bsCreateProjectSprintTaskModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private projectPlannerSprintService: ProjectPlannerSprintService
    ) {
    }

    get projectSprintTaskControl() {
        return this.createProjectSprintTaskForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.setStatus();
        this.loadForms();
        this.getUsers();
    }

    loadForms() {

        if (this.sprint.start_date) {
            this.sprintStartDate = new Date(this.sprint.start_date);
        }
        if (this.sprint.end_date) {
            this.sprintEndDate = new Date(this.sprint.end_date);
        }

        this.createProjectSprintTaskForm = this.formBuilder.group({
            project_sprint_id: [this.sprint.id],
            type: [this.sprint.type],
            name: ['', [Validators.required, Validators.maxLength(255)]],
            assign_to: [null],
            start_date: [null],
            end_date: [null],
            status: [1, Validators.required],
            estimated_hours: ['', Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            description: ['']
        });
        this.isPageLoaded = true;
    }

    setStatus() {
        if (this.sprint.type == 'Story') {
            this.statusLists = [
                {id: 1, name: this.translate.instant('common.status.open')},
                {id: 2, name: this.translate.instant('common.status.in_progress')},
                {id: 3, name: this.translate.instant('common.status.closed')}
            ];
        } else {
            this.statusLists = [
                {id: 1, name: this.translate.instant('common.status.open')},
                {id: 2, name: this.translate.instant('common.status.on_hold')},
                {id: 3, name: this.translate.instant('common.status.closed')}
            ];
        }
    }

    getUsers() {
        this.users = this.sprint.sprint_members;
    }

    startDateChange(event: any) {
        this.createProjectSprintTaskForm.patchValue({end_date: event});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        this.isHoursValid = false;
        if (this.createProjectSprintTaskForm.invalid) {
            return;
        }

        // --
        // Hours validation
        if (this.createProjectSprintTaskForm.value.estimated_hours && this.sprint.hours) {
            let projectHours = this.sprint.hours.replace(/:/g, '.'),
                sprintHours = this.createProjectSprintTaskForm.value.estimated_hours.replace(/:/g, '.');
            if (parseInt(projectHours) < parseInt(sprintHours)) {
                this.isHoursValid = true;
                return;
            }
        }

        this.projectPlannerSprintService.createTask(this.createProjectSprintTaskForm.value).subscribe(data => {
            this.toastr.success(this.createProjectSprintTaskForm.value.type + this.translate.instant('project_planner.sprint_task.messages.create'), this.translate.instant('project_planner.title'));
            this.event.emit({data});
            this.onCancel();
        });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateProjectSprintTaskModalRef.hide();
    }

}
