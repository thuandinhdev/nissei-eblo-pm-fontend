import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ProjectPlannerSprintService} from './../../../../../core/services/project-planner-sprint.service';

@Component({
    selector: 'app-move-task-modal',
    templateUrl: './move-task-modal.component.html',
    styleUrls: ['./move-task-modal.component.scss']
})

export class MoveTaskModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    moveTaskForm: FormGroup;
    isFormSubmitted = false;
    isPageLoaded = false;
    taskId: any;
    sprintId: any;
    sprints: any;

    constructor(
        public translate: TranslateService,
        public bsMoveTaskModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private projectPlannerService: ProjectPlannerSprintService
    ) {
    }

    get projectPlannerControl() {
        return this.moveTaskForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();
        this.isPageLoaded = true;
    }

    loadForms() {
        this.moveTaskForm = this.formBuilder.group({
            task_id: [this.taskId],
            sprint_id: [this.sprintId, Validators.required]
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.moveTaskForm.invalid) {
            return;
        }

        this.projectPlannerService.moveTask(this.moveTaskForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('project_planner.move_sprint_task.messages.move'), this.translate.instant('project_planner.title'));
            this.event.emit({data});
            this.onCancel();
        });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsMoveTaskModalRef.hide();
    }

}
