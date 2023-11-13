import {Component, OnInit, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {HttpClient} from '@angular/common/http';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {TranslationService} from '../../../../core/services/translation.service';
import {HelperService} from '../../../../core/services/helper.service';
import {AuthenticationService} from '../../../../core/services/authentication.service';

import {CreateTranslationComponent} from './components/create-translation/create-translation.component';
import {EditTranslationComponent} from './components/edit-translation/edit-translation.component';

import {environment} from '../../../../../environments/environment';
import {DatatablesResponse} from '../../../../core/helpers/datatables-response.helper';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-translations-settings',
    templateUrl: './translations-settings.component.html',
    styleUrls: ['./translations-settings.component.scss']
})

export class TranslationsSettingsComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    translations = [];
    loginUser: any;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'translation_table',
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
        private http: HttpClient,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private exportAsService: ExportAsService,
        private translationService: TranslationService,
        private helperService: HelperService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadTranslationDatatable();
    }

    loadTranslationDatatable() {
        var that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: this.loginUser.settings.tables_pagination_limit,
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
                'sortable': true,
                'target': [2]
            }, {
                'sortable': false,
                'width': '5%',
                'target': [3]
            }
            ],
            buttons: [{
                extend: 'csv',
                title: this.translate.instant('settings.translations.title'),
                className: 'btn btn-datatable-gredient',
                action: function (e, dt, node, config) {
                    that.exportFiles('csv');
                }
            }, {
                extend: 'excel',
                title: this.translate.instant('settings.translations.title'),
                className: 'btn btn-datatable-gredient',
                action: function (e, dt, node, config) {
                    that.exportFiles('xlsx');
                }
            }, {
                extend: 'pdf',
                title: this.translate.instant('settings.translations.title'),
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
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-translations', dataTablesParameters, {})
                    .subscribe(resp => {
                        this.translations = resp.data;

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
        this.exportAsService.save(this.exportAsConfig, 'translations').subscribe(() => {
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

                if (this.translations.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    openTranslationCreateModal() {
        this.modalRef = this.modalService.show(CreateTranslationComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    openTranslationEditModal(translation) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered animated fadeIn',
            initialState: {
                translation: translation
            }
        };

        this.modalRef = this.modalService.show(EditTranslationComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    setActiveInactiveTranslation(value: boolean, translation) {
        translation.status = value;
        this.translationService.update(translation)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.translations.messages.status'), this.translate.instant('settings.translations.title'));
                    this.rerender();
                });
    }

    translationDelete(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('settings.translations.title1'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {

                // --
                // this.toastr.error(this.translate.instant('common.not_allowed'));
                // return;

                this.translationService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('settings.translations.messages.delete'), this.translate.instant('settings.translations.title'));
                            this.rerender();
                        });
            }
        });
    }

}
