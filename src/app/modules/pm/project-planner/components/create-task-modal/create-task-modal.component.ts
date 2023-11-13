import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ProjectPlannerSprintService} from './../../../.././../core/services/project-planner-sprint.service';

@Component({
    selector: 'app-create-task-modal',
    templateUrl: './create-task-modal.component.html',
    styleUrls: ['./create-task-modal.component.scss']
})

export class CreateTaskModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createProjectSprintTaskForm: FormGroup;
    project: any;
    isFormSubmitted = false;
    isPageLoaded = false;
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
        // if (this.sprint.start_date) {
        // 	this.sprintStartDate = new Date(this.sprint.start_date);
        // }
        // if (this.sprint.end_date) {
        // 	this.sprintEndDate = new Date(this.sprint.end_date);
        // }

        this.createProjectSprintTaskForm = this.formBuilder.group({
            project_id: [this.project.id],
            type: [this.project.type],
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
        if (this.project.type == 'Story') {
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
        this.createProjectSprintTaskForm.patchValue({end_date: event});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createProjectSprintTaskForm.invalid) {
            return;
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
