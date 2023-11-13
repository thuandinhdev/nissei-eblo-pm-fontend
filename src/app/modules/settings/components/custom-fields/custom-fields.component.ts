import {Component, OnInit, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {HttpClient} from '@angular/common/http';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {CustomFieldsService} from '../../../../core/services/custom-fields.service';
import {HelperService} from '../../../../core/services/helper.service';
import {AuthenticationService} from '../../../../core/services/authentication.service';

import {CustomFieldCreateComponent} from './../custom-field-create/custom-field-create.component';
import {CustomFieldEditComponent} from './../custom-field-edit/custom-field-edit.component';

import {DatatablesResponse} from '../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

declare let $: any;

@Component({
    selector: 'app-custom-fields',
    templateUrl: './custom-fields.component.html',
    styleUrls: ['./custom-fields.component.scss']
})

export class CustomFieldsComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    formTables: any;
    dtOptions: any = {};
    loginUser: any;
    customFields = [];
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'custom_field_table',
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
        private modalService: BsModalService,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private customFieldsService: CustomFieldsService,
        private helperService: HelperService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.getAllFormFields();
        this.loadCustomFieldDatatable();
    }

    loadCustomFieldDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            columns: [{
                'sortable': true,
                'width': '2%',
                'target': [0]
            }, {
                'sortable': true,
                'target': [1]
            }, {
                'sortable': true,
                'target': [2]
            }, {
                'sortable': false,
                'target': [3]
            }, {
                'sortable': false,
                'target': [4]
            }, {
                'sortable': false,
                'width': '5%',
                'target': [5]
            }],
            buttons: [{
                extend: 'csv',
                title: this.translate.instant('settings.custom_fields.title'),
                className: 'btn btn-datatable-gredient',
                action: function (e, dt, node, config) {
                    that.exportFiles('csv');
                }
            }, {
                extend: 'excel',
                title: this.translate.instant('settings.custom_fields.title'),
                className: 'btn btn-datatable-gredient',
                action: function (e, dt, node, config) {
                    that.exportFiles('xlsx');
                }
            }, {
                extend: 'pdf',
                title: this.translate.instant('settings.custom_fields.title'),
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
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-customfields', dataTablesParameters, {})
                    .subscribe(resp => {
                        this.customFields = resp.data;
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
        this.exportAsService.save(this.exportAsConfig, 'customField').subscribe(() => {
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

                if (this.customFields.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    getAllFormFields() {
        this.customFieldsService.getFormTables()
            .subscribe(
                data => {
                    this.formTables = data;
                    let keyValue = [];
                    for (let iRow = 0; iRow < this.formTables.length; iRow++) {
                        keyValue[this.formTables[iRow].id] = this.formTables[iRow].name;
                    }
                    this.formTables = keyValue;
                });
    }

    changeStatus(event, id) {
        this.customFieldsService.changeStatus({id: id, status: event})
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.custom_fields.messages.status'), this.translate.instant('settings.custom_fields.title'));
                    this.rerender();
                });
    }

    openCustomFieldCreateModal() {
        this.modalRef = this.modalService.show(CustomFieldCreateComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    openCustomFieldEditModal(CustomField) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered animated fadeIn',
            initialState: {
                customField: CustomField
            }
        };
        this.modalRef = this.modalService.show(CustomFieldEditComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    removeCustomField(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('settings.custom_fields.title1'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.customFieldsService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('settings.custom_fields.messages.delete'), this.translate.instant('settings.custom_fields.title'));
                            this.rerender();
                        });
            }
        });
    }

    saveCustomFieldDetail(index, name, value) {
        this.customFields[index][name] = value;
        this.customFieldsService.update(this.customFields[index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.custom_fields.messages.update'), this.translate.instant('settings.custom_fields.title'));
                    this.rerender();
                });
    }
}

