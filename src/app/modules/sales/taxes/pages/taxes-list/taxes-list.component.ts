import {Component, OnInit, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {HttpClient} from '@angular/common/http';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {TaxService} from '../../../../../core/services/tax.service';

import {CreateTaxComponent} from '../../components/create-tax/create-tax.component';
import {EditTaxComponent} from '../../components/edit-tax/edit-tax.component';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-taxes-list',
    templateUrl: './taxes-list.component.html',
    styleUrls: ['./taxes-list.component.scss']
})

export class TaxesListComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    taxes = [];
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'tax_table',
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
        private modalService: BsModalService,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private taxService: TaxService
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
            serverSide: false,
            processing: false,
            dom: '<"html5buttons"B>ltfrtip',
            buttons: [{
                extend: 'csv',
                title: this.translate.instant('taxes.title'),
                className: 'btn btn-datatable-gredient',
            }, {
                extend: 'excel',
                title: this.translate.instant('taxes.title'),
                className: 'btn btn-datatable-gredient',
            }, {
                extend: 'pdf',
                title: this.translate.instant('taxes.title'),
                className: 'btn btn-datatable-gredient',
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
            columnDefs: [
                {width: '5%', targets: [0]},
                {width: '5%', targets: [3], sortable: false}
            ]
        };

        this.getTaxes();
    }

    getTaxes(isLoad = false) {
        this.taxService.getAll().subscribe(
            data => {
                this.taxes = data;

                if (isLoad) {
                    this.rerender();
                } else {
                    this.dtTrigger.next();
                }
            });
    }

    openTaxCreateModal() {
        this.modalRef = this.modalService.show(CreateTaxComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getTaxes(true);
        });
    }

    openTaxEditModal(tax) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                tax: tax
            }
        };

        this.modalRef = this.modalService.show(EditTaxComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getTaxes(true);
        });
    }

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('taxes.title')).subscribe(() => {
        });
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();

            setTimeout(() => {
                this.dtTrigger.next();
            });
        });
    }

    deleteTax(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('taxes.title2'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.taxService.delete(id).subscribe(data => {
                    this.toastr.success(this.translate.instant('taxes.messages.delete'), this.translate.instant('taxes.title1'));
                    this.getTaxes(true);
                });
            }
        });
    }
}
