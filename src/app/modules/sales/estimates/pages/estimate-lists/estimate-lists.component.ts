import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';

import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {EstimateService} from '../../../../../core/services/estimate.service';

import {estimate_status_value} from '../../../../../core/helpers/sale.helper';
import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../../environments/environment';

import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-estimate-lists',
    templateUrl: './estimate-lists.component.html',
    styleUrls: ['./estimate-lists.component.scss']
})
export class EstimateListsComponent implements OnInit {
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    estimates = [];
    settings: any;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'estimate_table',
    };
    estimateStatusKeyValue = estimate_status_value;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private exportAsService: ExportAsService,
        private http: HttpClient,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private estimateService: EstimateService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadDatatable();
    }

    loadDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            order: [0],
            columns: [
                {
                    'sortable': true,
                    'width': '16%',
                    'target': [0]
                },
                {
                    'sortable': true,
                    'width': '16%',
                    'target': [1]
                },
                {
                    'sortable': true,
                    'width': '16%',
                    'target': [2]
                },
                {
                    'sortable': true,
                    'width': '16%',
                    'target': [3]
                },
                {
                    'sortable': true,
                    'width': '16%',
                    'target': [4]
                },
                {
                    'sortable': true,
                    'width': '15%',
                    'target': [5]
                },
                {
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
                this.http.post<DatatablesResponse>(this.apiUrl + '/api/all-estimates', dataTablesParameters, {}).subscribe(resp => {
                    this.estimates = resp.data;
                    this.settings = resp;
                    this.settings = this.settings.settings;
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
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('estimates.title')).subscribe(() => {
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

                if (this.estimates.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    changeEstimateStatus(id: any, status: any) {
        this.estimateService.changeStatus({'id': id, 'status': status.id}).subscribe(data => {
            this.toastr.success(this.translate.instant('estimates.messages.status'), this.translate.instant('estimates.title'));
            this.rerender();
        });
    }

    deleteEstimate(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + this.translate.instant('estimates.title1'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.estimateService.delete(id).subscribe(data => {
                    this.toastr.success(this.translate.instant('estimates.messages.delete'), this.translate.instant('estimates.title'));
                    this.rerender();
                });
            }
        });
    }

    getTranslateStatus(statusKey) {
        return this.estimateStatusKeyValue[statusKey];
    }

}
