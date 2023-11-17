import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {TaskService} from '../../../../../core/services/task.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {TaskImportModalComponent} from './../../components/task-import-modal/task-import-modal.component';

import {task_status_key_value} from './../../../../../core/helpers/pm-helper';
import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    preserveWhitespaces: true
})

export class TaskListComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    countStatus: any;
    statusfilterId = 0;
    projectCount: any;
    tasks = [];
    taskstatusKeyValue = task_status_key_value;
    taskFilterKey = 'selected';
    isPageLoaded = false;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'tasks_table',
    };
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };
    modalConfigs = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered animated fadeIn'
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private modalService: BsModalService,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private taskService: TaskService,
        private router: Router,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadTaskDatatable();
    }

    loadTaskDatatable() {
        this.statusfilterId = 0;
        if (this.route.snapshot.params['statusId']) {
            this.statusfilterId = this.route.snapshot.params['statusId'];
        }
        if (this.route.snapshot.params['taskFilterKey']) {
            this.taskFilterKey = this.route.snapshot.params['taskFilterKey'];
        }

        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            // order: [0],
            // columns: [
            //     {
            //         'sortable': true,
            //         'width': '7%',
            //         'target': [0]
            //     },
            //     {
            //         'sortable': true,
            //         'target': [1]
            //     },
            //     {
            //         'sortable': true,
            //         'width': '8%',
            //         'target': [2]
            //     },
            //     {
            //         'sortable': true,
            //         'width': '8%',
            //         'target': [3]
            //     },
            //     {
            //         'sortable': true,
            //         'width': '8%',
            //         'target': [4]
            //     },
            //     {
            //         'sortable': true,
            //         'width': '10%',
            //         'target': [5]
            //     },
            //     {
            //         'sortable': true,
            //         'width': '10%',
            //         'target': [6]
            //     },
            //     {
            //         'sortable': true,
            //         'width': '10%',
            //         'target': [7]
            //     },
            //     {
            //         'sortable': false,
            //         'width': '5%',
            //         'target': [8]
            //     }
            // ],
            buttons: [
                // {
                //     extend: 'csv',
                //     title: this.translate.instant('tasks.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('csv');
                //     }
                // }, {
                //     extend: 'excel',
                //     title: this.translate.instant('tasks.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('xlsx');
                //     }
                // }, {
                //     extend: 'pdf',
                //     title: this.translate.instant('tasks.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('pdf');
                //     }
                // }
            ],
            language: {
                'sEmptyTable': this.translate.instant('common.datatable.sEmptyTable'),
                'sInfo': this.translate.instant('common.datatable.sInfo'),
                'sInfoEmpty': this.translate.instant('common.datatable.sInfoEmpty'),
                'sSearch': '',
                'sInfoPostFix': this.translate.instant('common.datatable.sInfoPostFix'),
                'sInfoThousands': this.translate.instant('common.datatable.sInfoThousands'),
                'sLengthMenu': this.translate.instant('common.datatable.sLengthMenu'),
                'sLoadingRecords': this.translate.instant('common.datatable.sLoadingRecords'),
                'sProcessing': this.translate.instant('common.datatable.sProcessing'),
                'sZeroRecords': this.translate.instant('common.datatable.sZeroRecords'),
                'sSearchPlaceholder': this.translate.instant('common.datatable.sSearchPlaceholder'),
                'oPaginate': {
                    'sFirst': this.translate.instant('common.datatable.oPaginate.sFirst'),
                    'sLast': this.translate.instant('common.datatable.oPaginate.sLast'),
                    'sNext': this.translate.instant('common.datatable.oPaginate.sNext'),
                    'sPrevious': this.translate.instant('common.datatable.oPaginate.sPrevious')
                },
                'oAria': {
                    'sSortAscending': this.translate.instant('common.datatable.oAria.sSortAscending'),
                    'sSortDescending': this.translate.instant('common.datatable.oAria.sSortDescending')
                }
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters = {
                    columns: dataTablesParameters.columns,
                    draw: dataTablesParameters.draw,
                    length: dataTablesParameters.length,
                    order: dataTablesParameters.order,
                    search: dataTablesParameters.search,
                    start: dataTablesParameters.start,
                    status: this.statusfilterId,
                    filter: this.taskFilterKey
                };
                this.http
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-tasks', dataTablesParameters, {})
                    .subscribe(resp => {
                        this.isPageLoaded = true;
                        this.tasks = resp.data;
                        this.countStatus = resp;
                        this.countStatus = this.countStatus.statusCount;
                        if (this.countStatus.all == 0) {
                            this.countStatus.all = 0;
                            this.countStatus.open = 0;
                            this.countStatus.in_progress = 0;
                            this.countStatus.completed = 0;
                        }

                        callback({
                            recordsTotal: resp.recordsTotal,
                            recordsFiltered: resp.recordsFiltered,
                            data: [],
                        });
                    });
            }
        };
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            setTimeout(() => {
                this.dtTrigger.next();

                if (this.tasks.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('tasks.title')).subscribe(() => {
        });
    }

    getCheckPermission(task) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            return true;
        } else if (task.assign_to == this.loginUser.id || task.created_by == this.loginUser.id) {
            return true;
        } else {
            return false;
        }
    }
    changeTaskStatus(taskID: any, status: any, index: any) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            // text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmText'),
            cancelButtonText: this.translate.instant('common.swal.cancel')
        }).then((result) => {
            if (result.value) {
                // this.tasks[index].status = status.id;
                let changeTask = {
                    id: taskID,
                    status: status.id
                };
                this.taskService.changeStatus(changeTask)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('tasks.messages.status'), this.translate.instant('tasks.title'));
                            this.rerender();
                        });
            } else {

            }
        });
    }
    // changeTaskStatus(taskID: any, status: any) {
    //     let changeTask = {
    //         id: taskID,
    //         status: status.id
    //     };
    //     this.taskService.changeStatus(changeTask)
    //         .subscribe(
    //             data => {
    //                 this.toastr.success(this.translate.instant('tasks.messages.status'), this.translate.instant('tasks.title'));
    //                 this.rerender();
    //             });
    // }

    filterByStatus(statusID, taskFilterKey) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate(['tasks', statusID, taskFilterKey]);
    }

    getTaskStatus(status) {
        return 'tasks.status' + status;
    }

    getTranslateStatus(statusKey) {
        return this.taskstatusKeyValue[statusKey];
    }

    saveTaskDetail(index, name, value) {
        this.tasks[index][name] = value;
        this.taskService.update(this.tasks[index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('tasks.messages.update'), this.translate.instant('tasks.title'));
                    this.rerender();
                });
    }

    deleteTask(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.taskService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('tasks.messages.delete'), this.translate.instant('tasks.title'));
                            this.rerender();
                        });
            }
        });
    }

    openTaskImportModal() {
        this.modalRef = this.modalService.show(TaskImportModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.toastr.success(this.translate.instant('tasks.messages.import'), this.translate.instant('tasks.title'));
            this.rerender();
        });
    }
}
