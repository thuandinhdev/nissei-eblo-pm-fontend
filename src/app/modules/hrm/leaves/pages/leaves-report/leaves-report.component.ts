import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {DataTableDirective} from 'angular-datatables';
import {TranslateService} from '@ngx-translate/core';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {NgxRolesService} from 'ngx-permissions';
import {Subject} from 'rxjs';

import {LeaveService} from '../../../../../core/services/leave.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {UserService} from '../../../../../core/services/user.service';

import {LeaveDetailComponent} from '../../components/leave-detail/leave-detail.component';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-leaves-report',
    templateUrl: './leaves-report.component.html',
    styleUrls: ['./leaves-report.component.scss']
})

export class LeavesReportComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    leaves = [];
    users: any;
    period_from: any;
    period_to: any;
    period_from_to: Date[];
    isFormLoad = false;
    user_id = null;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'leaves_table',
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private http: HttpClient,
        private datepipe: DatePipe,
        private modalService: BsModalService,
        private exportAsService: ExportAsService,
        private authenticationService: AuthenticationService,
        private leaveService: LeaveService,
        private userService: UserService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.getUsers();
        this.loadLeaveDatatable();
    }

    loadLeaveDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            order: [1, 'asc'],
            columns: [{
                'sortable': false,
                'width': '2%',
                'target': [0]
            }, {
                'sortable': true,
                'target': [1]
            }, {
                'sortable': false,
                'width': '10%',
                'target': [2]
            }, {
                'sortable': false,
                'width': '10%',
                'target': [3]
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
                if (this.isFormLoad) {
                    dataTablesParameters.period_from = this.period_from;
                    dataTablesParameters.period_to = this.period_to;
                    dataTablesParameters.user_id = this.user_id;
                }
                this.http
                    .post<DatatablesResponse>(this.apiUrl + '/api/leaves/report', dataTablesParameters, {})
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

    getUsers() {
        this.userService.getAll()
            .subscribe(
                data => {
                    this.users = data;
                });
    }

    submitFilter() {
        if (this.period_from_to) {
            this.period_from = this.datepipe.transform(this.period_from_to[0], 'yyyy-MM-dd');
            this.period_to = this.datepipe.transform(this.period_from_to[1], 'yyyy-MM-dd');
        }
        this.isFormLoad = true;
        this.rerender();
    }

    resetForm() {
        this.isFormLoad = false;
        this.period_from_to = null;
        this.user_id = null;
        this.rerender();
    }

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('leave_report.title')).subscribe(() => {
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

    openLeaveDetail(status, user_id) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-lg animated fadeIn',
            initialState: {
                leave: {
                    startDate: this.period_from,
                    endDate: this.period_to,
                    userId: user_id,
                    status: status
                }
            }
        };

        this.modalRef = this.modalService.show(LeaveDetailComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
        });
    }
}
