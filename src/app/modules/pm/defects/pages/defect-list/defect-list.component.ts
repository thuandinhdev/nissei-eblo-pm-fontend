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

import {DefectService} from '../../../../../core/services/defect.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {defect_status_key_value} from './../../../../../core/helpers/pm-helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-defect-list',
    templateUrl: './defect-list.component.html',
    styleUrls: ['./defect-list.component.scss'],
    preserveWhitespaces: true
})

export class DefectListComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    defects = [];
    loginUser: any;
    defectCount: any;
    countStatus: any;
    statusfilterId: number;
    defectstatusKeyValue = defect_status_key_value;
    defectFilterKey = 'selected';
    isPageLoaded = false;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'defects_table',
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
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private modalService: BsModalService,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private defectService: DefectService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadDefectDatatable();
    }

    getTranslateStatus(statusKey) {
        return this.defectstatusKeyValue[statusKey];
    }

    loadDefectDatatable() {
        this.statusfilterId = 0;
        if (this.route.snapshot.params['status']) {
            this.statusfilterId = this.route.snapshot.params['status'];
        }
        if (this.route.snapshot.params['defectFilterKey']) {
            this.defectFilterKey = this.route.snapshot.params['defectFilterKey'];
        }

        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            // order: [0],
            columns: [
                {
                    'sortable': true,
                    'width': '8%',
                    'target': [0]
                },
                {
                    'sortable': true,
                    'target': [1]
                },
                {
                    'sortable': true,
                    'width': '8%',
                    'target': [2]
                },
                {
                    'sortable': true,
                    'width': '8%',
                    'target': [3]
                },
                {
                    'sortable': true,
                    'width': '8%',
                    'target': [4]
                },
                {
                    'sortable': true,
                    'width': '10%',
                    'target': [5]
                },
                {
                    'sortable': true,
                    'width': '10%',
                    'target': [6]
                },
                {
                    'sortable': true,
                    'width': '10%',
                    'target': [7]
                },
                {
                    'sortable': false,
                    'target': [8],
                    'width': '5%'
                }
            ],
            buttons: [
                // {
                //     extend: 'csv',
                //     title: this.translate.instant('defects.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('csv');
                //     }
                // }, {
                //     extend: 'excel',
                //     title: this.translate.instant('defects.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('xlsx');
                //     }
                // }, {
                //     extend: 'pdf',
                //     title: this.translate.instant('defects.title'),
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
                    filter: this.defectFilterKey
                };
                this.http
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-defects', dataTablesParameters, {})
                    .subscribe(resp => {
                        this.isPageLoaded = true;
                        this.defects = resp.data;
                        this.countStatus = resp;
                        this.countStatus = this.countStatus.statusCount;
                        if (this.countStatus.all == 0) {
                            this.countStatus.open = 0;
                            this.countStatus.in_progress = 0;
                            this.countStatus.assigned = 0;
                            this.countStatus.solved = 0;
                            this.countStatus.deferred = 0;
                            this.countStatus.re_open = 0;
                            this.countStatus.closed = 0;
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

                if (this.defects.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('defects.title')).subscribe(() => {
        });
    }

    filterByStatus(statusID, defectFilterKey) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate(['defects', statusID, defectFilterKey]);
    }

    getCheckPermission(defect) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            return true;
        } else if (defect.assign_member == this.loginUser.id || defect.create_user_id == this.loginUser.id) {
            return true;
        } else {
            return false;
        }
    }

    deleteDefect(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.defectService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('defects.messages.delete'), this.translate.instant('defects.title'));
                            this.rerender();
                        });
            }
        });
    }

    changeDefectStatus(defectId: any, status: any) {
        let changeDefect = {
            id: defectId,
            status: status.id
        };
        this.defectService.changeStatus(changeDefect)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('defects.messages.status'), this.translate.instant('defects.title'));
                    this.rerender();
                });
    }

    saveDefectDetail(index, name, value) {
        this.defects[index][name] = value;
        this.defectService.update(this.defects[index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('defects.messages.update'), this.translate.instant('defects.title'));
                    this.rerender();
                });
    }
}
