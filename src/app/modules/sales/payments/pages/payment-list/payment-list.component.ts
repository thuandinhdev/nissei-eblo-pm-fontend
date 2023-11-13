import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';

import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {PaymentService} from '../../../../../core/services/payment.service';

import {EditPaymentComponent} from '../../components/edit-payment/edit-payment.component';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../../environments/environment';

import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-payment-list',
    templateUrl: './payment-list.component.html',
    styleUrls: ['./payment-list.component.scss']
})

export class PaymentListComponent implements OnInit {
    public apiUrl = environment.apiUrl;
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    payments = [];
    settings: any;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'payments_table',
    };

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private modalService: BsModalService,
        private exportAsService: ExportAsService,
        private http: HttpClient,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private paymentService: PaymentService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadDatatable();
    }

    getCheckPermission(client_id) {
        let isDownloadable = false;
        let role = this.ngxRolesService.getRole('admin');

        if (this.loginUser.id == client_id) {
            isDownloadable = true;
        }

        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            isDownloadable = true;
        }

        return isDownloadable;
    }

    loadDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            order: [0],
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            columns: [
                {
                    'sortable': true,
                    'width': '13%',
                    'target': [0]
                },
                {
                    'sortable': true,
                    'width': '13%',
                    'target': [1]
                },
                {
                    'sortable': true,
                    'width': '13%',
                    'target': [2]
                },
                {
                    'sortable': true,
                    'width': '18%',
                    'target': [3]
                },
                {
                    'sortable': true,
                    'width': '13%',
                    'target': [4]
                },
                {
                    'sortable': true,
                    'width': '13%',
                    'target': [5]
                },
                {
                    'sortable': true,
                    'width': '12%',
                    'target': [6]
                },
                {
                    'sortable': false,
                    'width': '5%',
                    'target': [7]
                }
            ],
            buttons: [
                {
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
                }
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
                };
                this.http.post<DatatablesResponse>(this.apiUrl + '/api/all-payments', dataTablesParameters, {}).subscribe(resp => {
                    that.payments = resp.data;
                    that.settings = resp;
                    that.settings = that.settings.settings;
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
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('payments.title')).subscribe(() => {
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

                if (this.payments.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    openPaymentEditModal(payment) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered animated fadeIn',
            initialState: {
                payment: payment
            }
        };

        this.modalRef = this.modalService.show(EditPaymentComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    deletePayment(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + this.translate.instant('payments.title').toLowerCase() + '!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.paymentService.delete(id).subscribe(data => {
                    this.toastr.success(this.translate.instant('payments.messages.delete'), this.translate.instant('payments.title'));
                    this.rerender();
                });
            }
        });
    }

}
