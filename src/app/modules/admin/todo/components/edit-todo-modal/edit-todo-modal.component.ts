import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {Todo} from '../../../../../shared/models/todo.model';

import {UserService} from '../../../../../core/services/user.service';
import {TodoService} from '../../../../../core/services/todo.service';

@Component({
    selector: 'app-edit-todo-modal',
    templateUrl: './edit-todo-modal.component.html',
    styleUrls: ['./edit-todo-modal.component.scss']
})

export class EditTodoModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editTodoForm: FormGroup;
    todo: Todo;
    isFormSubmitted = false;
    users = [];
    assignMembers = [];
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private userService: UserService,
        private todoService: TodoService
    ) {
    }

    get todoControl() {
        return this.editTodoForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();

        this.loadForms();
    }

    loadForms() {
        this.editTodoForm = this.formBuilder.group({
            id: [this.todo.id],
            description: [this.todo.description, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
            status: [this.todo.status, Validators.required],
            due_date: [new Date(this.todo.due_date), Validators.required],
            module_id: [this.todo.module_id],
            module_related_id: [this.todo.module_related_id]
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editTodoForm.invalid) {
            return;
        }

        this.todoService.update(this.editTodoForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('todos.messages.update'), this.translate.instant('todos.title'));
                    this.event.emit({data: true});
                    this.onCancel();
                }, error => {
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

}
