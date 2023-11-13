import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ProjectPlannerSprintService} from './../../../.././../core/services/project-planner-sprint.service';
import {TaskService} from '../../../../../core/services/task.service';

@Component({
    selector: 'app-edit-sprint-task-modal',
    templateUrl: './edit-sprint-task-modal.component.html',
    styleUrls: ['./edit-sprint-task-modal.component.scss']
})

export class EditSprintTaskModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editProjectSprintTaskForm: FormGroup;
    sprint: any;
    taskId: any;
    task: any;
    isFormSubmitted = false;
    isPageLoaded = false;
    isHoursValid = false;
    sprintStartDate: Date;
    sprintEndDate: Date;
    users = [];
    statusLists = [];
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public bsEditProjectSprintTaskModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private projectPlannerSprintService: ProjectPlannerSprintService,
        private taskService: TaskService,
        public datepipe: DatePipe
    ) {
    }

    get projectSprintTaskControl() {
        return this.editProjectSprintTaskForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getTaskById(this.taskId);
    }

    loadForms() {

        this.setDateFormat();
        this.users = this.sprint.sprint_members;

        this.editProjectSprintTaskForm = this.formBuilder.group({
            id: [this.taskId],
            project_sprint_id: [this.task.project_sprint_id],
            project_id: [this.sprint.project_id],
            type: [this.task.type],
            name: [this.task.name, [Validators.required, Validators.maxLength(255)]],
            assign_to: [this.task.assign_to],
            start_date: [this.task.start_date],
            end_date: [this.task.end_date],
            status: [this.task.status, Validators.required],
            estimated_hours: [this.task.estimated_hours, Validators.pattern(/^[0-9]+\:[0-5][0-9]$/)],
            description: [this.task.description]
        });
        this.isPageLoaded = true;
    }

    setDateFormat() {
        if (this.sprint.start_date) {
            this.sprintStartDate = new Date(this.sprint.start_date);
        }
        if (this.sprint.end_date) {
            this.sprintEndDate = new Date(this.sprint.end_date);
        }

        if (this.task.start_date) {
            this.task.start_date = new Date(this.task.start_date);
        }
        if (this.task.end_date) {
            this.task.end_date = new Date(this.task.end_date);
        }
    }

    setStatus() {
        if (this.task.type == 'Story') {
            this.statusLists = [
                {id: 1, name: this.translate.instant('common.status.open')},
                {id: 2, name: this.translate.instant('common.status.in_progress')},
                {id: 3, name: this.translate.instant('common.status.closed')}
            ];
        } else {
            this.statusLists = [
                {id: 1, name: this.translate.instant('common.status.open')},
                {id: 2, name: this.translate.instant('common.status.on_hold')},
                {id: 3, name: this.translate.instant('common.status.closed')},
                {id: 4, name: this.translate.instant('common.status.released')}
            ];
        }
    }

    startDateChange(event: any) {
        this.editProjectSprintTaskForm.patchValue({end_date: this.editProjectSprintTaskForm.value.start_date});
    }

    getTaskById(taskID) {
        this.projectPlannerSprintService.getSprintTaskById(taskID).subscribe(data => {
            this.task = data;
            this.setStatus();
            this.loadForms();
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        this.isHoursValid = false;
        if (this.editProjectSprintTaskForm.invalid) {
            return;
        }

        // --
        // Hours validation
        if (this.editProjectSprintTaskForm.value.estimated_hours && this.sprint.hours) {
            let projectHours = this.sprint.hours.replace(/:/g, '.'),
                sprintHours = this.editProjectSprintTaskForm.value.estimated_hours.replace(/:/g, '.');
            if (parseInt(projectHours) < parseInt(sprintHours)) {
                this.isHoursValid = true;
                return;
            }
        }

        // --
        // Date Format
        this.editProjectSprintTaskForm.patchValue({start_date: this.datepipe.transform(this.editProjectSprintTaskForm.value.start_date, 'yyyy-MM-dd')});
        this.editProjectSprintTaskForm.patchValue({end_date: this.datepipe.transform(this.editProjectSprintTaskForm.value.end_date, 'yyyy-MM-dd')});
        // this.editProjectSprintTaskForm.patchValue({ task_members: this.editProjectSprintTaskForm.value.task_members });

        if (this.editProjectSprintTaskForm.value.status == 4) {
            this.projectPlannerSprintService.updateTask(this.editProjectSprintTaskForm.value).subscribe(data => {
            });
            this.taskService.convertSprintTaskToTask(this.editProjectSprintTaskForm.value).subscribe(data => {
                this.toastr.success(this.translate.instant('project_planner.sprint_task.messages.released'), this.translate.instant('project_planner.title'));
                this.event.emit({data});
                this.onCancel();
            });
        } else {
            this.projectPlannerSprintService.updateTask(this.editProjectSprintTaskForm.value).subscribe(data => {
                this.toastr.success(this.editProjectSprintTaskForm.value.type + this.translate.instant('project_planner.sprint_task.messages.update'), this.translate.instant('project_planner.title'));
                this.event.emit({data});
                this.onCancel();
            });
        }

    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditProjectSprintTaskModalRef.hide();
    }

}
