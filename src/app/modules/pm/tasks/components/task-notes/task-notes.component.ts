import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {TaskService} from '../../../../../core/services/task.service';

@Component({
    selector: 'app-task-notes',
    templateUrl: './task-notes.component.html',
    styleUrls: ['./task-notes.component.scss']
})

export class TaskNotesComponent implements OnInit {
    @Input() task;
    @Input() permission: boolean;
    editNoteForm: FormGroup;
    notes: any;
    isFormSubmitted = false;

    constructor(
        public translate: TranslateService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private taskService: TaskService
    ) {
    }

    ngOnInit() {
        this.editNoteForm = this.formBuilder.group({
            id: [this.task.id],
            notes: [this.task.notes]
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editNoteForm.invalid) {
            return;
        }

        this.taskService.updateNotes(this.editNoteForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('notes.messages.update'), this.translate.instant('tasks.title'));
                });
    }
}
