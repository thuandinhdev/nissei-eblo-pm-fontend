import {Component, Input, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';
import {TranslateService} from '@ngx-translate/core';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {TodoService} from './../../../../core/services/todo.service';

@Component({
    selector: 'app-pm-dashboard-todos',
    templateUrl: './pm-dashboard-todos.component.html',
    styleUrls: ['./pm-dashboard-todos.component.scss'],
    providers: [DatePipe]
})

export class PmDashboardTodosComponent implements OnInit {
    public scrollConfig: PerfectScrollbarConfigInterface = {};
    @Input() loginUser;
    todos: any;
    isPageloaded = false;
    datepickerConfigs = {dateInputFormat: 'YYYY-MM-DD'};

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private modalService: BsModalService,
        private http: HttpClient,
        private toastr: ToastrService,
        private todoService: TodoService,
    ) {
    }

    ngOnInit() {
        this.getTodos();
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }

        this.changeTodosStatus();
    }

    getTodos() {
        this.todoService.getAllTodos({'length': 10})
            .subscribe(
                data => {
                    this.todos = data;
                    this.isPageloaded = true;
                }, error => {
                });
    }

    changeTodosStatus() {
        this.todoService.changeTodosStatus(this.todos)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('todos.messages.status'), this.translate.instant('todos.title'));
                });
    }

    changeStatus(todo, status) {
        todo.status = status;
        this.todoService.update(todo)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('todos.messages.update'), this.translate.instant('todos.title'));
                    this.getTodos();
                });
    }

    saveTodosDetail(todo, index, value) {
        todo[index] = value;
        this.todoService.update(todo)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('todos.messages.update'), this.translate.instant('todos.title'));
                });
    }

}
