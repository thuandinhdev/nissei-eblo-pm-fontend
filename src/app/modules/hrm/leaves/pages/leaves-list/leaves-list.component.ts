import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {NgxRolesService} from 'ngx-permissions';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {LeaveService} from '../../../../../core/services/leave.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {CreateLeaveComponent} from '../../components/create-leave/create-leave.component';
import {EditLeaveComponent} from '../../components/edit-leave/edit-leave.component';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {leave_status_key_value} from '../../../../../core/helpers/hrm.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-leaves-list',
    templateUrl: './leaves-list.component.html',
    styleUrls: ['./leaves-list.component.scss']
})

export class LeavesListComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    leaves = [];
    leaveStatusKeyValue = leave_status_key_value;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'leaves_table',
    };
    modalConfigs = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered modal-md animated fadeIn'
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private http: HttpClient,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private exportAsService: ExportAsService,
        private authenticationService: AuthenticationService,
        private leaveService: LeaveService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadLeaveDatatable();
    }

    getCheckStatusChangePermission(leave) {
        let role = this.ngxRolesService.getRole('admin');

        if (leave.status == 1) {
            if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
                return true;
            } else if (this.loginUser.id == leave.user_id) {
                return false;
            }
        }
        return false;
    }

    getCheckPermission(leave) {
        let isAllowed = false,
            role = this.ngxRolesService.getRole('admin');

        if (this.loginUser.id == leave.user_id) {
            isAllowed = true;
        }

        if (leave.status == 2 || leave.status == 3) {
            isAllowed = false;
        }

        return isAllowed;
    }

    loadLeaveDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            order: [0, 'desc'],
            columns: [{
                'sortable': true,
                'width': '5%',
                'target': [0]
            }, {
                'sortable': true,
                'width': '18%',
                'target': [1]
            }, {
                'sortable': true,
                'width': '18%',
                'target': [2]
            }, {
                'sortable': true,
                'width': '18%',
                'target': [3]
            }, {
                'sortable': true,
                'width': '18%',
                'target': [4]
            }, {
                'sortable': true,
                'width': '18%',
                'target': [5]
            }, {
                'sortable': false,
                'width': '5%',
                'target': [6]
            }
            ],
            buttons: [{
                extend: 'csv',
                className: 'btn btn-datatable-gredient',
                action: function (e, dt, node, config) {
                    that.exportFiles('csv');
                }
            }, {
                extend: 'excel',
                className: 'btn btn-datatable-gredient',
                action: function (e, dt, node, config) {
                    that.exportFiles('xlsx');
                }
            }, {
                extend: 'pdf',
                className: 'btn btn-datatable-gredient',
                action: function (e, dt, node, config) {
                    that.exportFiles('pdf');
                }
            }],
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
                this.http
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-leaves', dataTablesParameters, {})
                    .subscribe(resp => {
                        if (resp) {
                            this.leaves = resp.data;
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

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('leaves.title')).subscribe(() => {
        });
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

                if (this.leaves.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    openLeaveCreateModal() {
        this.modalRef = this.modalService.show(CreateLeaveComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    openLeaveEditModal(leave) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                leave: leave
            }
        };

        this.modalRef = this.modalService.show(EditLeaveComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    changeLeaveStatus(leaveId: any, status: any) {
        let leave = {
            id: leaveId,
            status: status.id
        };

        if (status.id == 3) {
            Swal.fire({
                input: 'textarea',
                inputPlaceholder: this.translate.instant('leaves.create.fields.reject_reason') + ' ...',
                inputAttributes: {
                    'aria-label': this.translate.instant('leaves.create.fields.reject_reason')
                },
                showCancelButton: true
            }).then((result) => {
                if (result.value || result.value == '') {
                    let leave = {
                        id: leaveId,
                        status: status.id,
                        reject_reason: result.value
                    };
                    this.changeStatus(leave);
                }
            });
        } else {
            this.changeStatus(leave);
        }
    }

    changeStatus(leave) {
        this.leaveService.changeStatus(leave)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('leaves.messages.status'), this.translate.instant('leaves.title'));
                    this.rerender();
                });
    }

    deleteLeave(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + this.translate.instant('leaves.title1'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.leaveService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('leaves.messages.delete'), this.translate.instant('leaves.title'));
                            this.rerender();
                        });
            }
        });
    }

    getTranslateStatus(statusKey) {
        return this.leaveStatusKeyValue[statusKey];
    }

}
