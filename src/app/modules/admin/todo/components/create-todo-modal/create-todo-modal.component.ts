import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {TodoService} from '../../../../../core/services/todo.service';

@Component({
    selector: 'app-create-todo-modal',
    templateUrl: './create-todo-modal.component.html',
    styleUrls: ['./create-todo-modal.component.scss']
})

export class CreateTodoModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createTodoForm: FormGroup;
    @Input() todoParams: any;
    minDate: Date;
    isFormSubmitted = false;
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public datepipe: DatePipe,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private todoService: TodoService
    ) {
    }

    get todoControl() {
        return this.createTodoForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.minDate = new Date();

        this.loadForms();
    }

    loadForms() {
        this.createTodoForm = this.formBuilder.group({
            description: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
            due_date: [new Date(), Validators.required],
            module_id: [this.todoParams.module_id],
            module_related_id: [this.todoParams.module_related_id]
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createTodoForm.invalid) {
            return;
        }
        this.createTodoForm.value.due_date = this.datepipe.transform(this.createTodoForm.value.due_date, 'yyyy-MM-dd');
        this.todoService.create(this.createTodoForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('todos.messages.create'), this.translate.instant('todos.title'));
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
