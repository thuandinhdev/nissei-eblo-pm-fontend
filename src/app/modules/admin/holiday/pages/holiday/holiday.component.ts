import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {BsDatepickerConfig, BsDatepickerViewMode} from 'ngx-bootstrap/datepicker';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {HolidayService} from '../../../../../core/services/holiday.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {CreateHolidayModalComponent} from '../../components/create-holiday-modal/create-holiday-modal.component';
import {EditHolidayModalComponent} from '../../components/edit-holiday-modal/edit-holiday-modal.component';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

import * as moment from 'moment';

@Component({
    selector: 'app-holiday',
    templateUrl: './holiday.component.html',
    styleUrls: ['./holiday.component.scss'],
    providers: [DatePipe]
})

export class HolidayComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    minMode: BsDatepickerViewMode = 'month';
    datepickerConfig: Partial<BsDatepickerConfig>;
    dtOptions: any = {};
    loginUser: any;
    holidayLists: any;
    year: Date;
    holidays = [];
    holidayTab = 'all';
    isPageLoaded = false;
    datepickerConfigs = {dateInputFormat: 'YYYY-MM-DD'};
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'holiday_table',
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
        private datePipe: DatePipe,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private holidayService: HolidayService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadHolidayDatatable();
        this.year = new Date();
        this.getHolidays(moment(this.year).format('YYYY'));
    }

    setHolidayTab($event) {
        this.holidayTab = $event.id;
        if ($event.id == 'all') {
            this.rerender();
        }
    }

    getActiveHolidayTab(tab) {
        return this.holidayTab === tab;
    }

    getHolidays(year) {
        this.holidayService.getAll(year)
            .subscribe(
                data => {
                    this.holidayLists = data;
                    this.isPageLoaded = true;
                });
    }

    loadHolidayDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            order: [0, 'desc'],
            columns: [
                {
                    'sortable': true,
                    'width': '15%',
                    'target': [0]
                },
                {
                    'sortable': true,
                    'target': [1]
                },
                {
                    'sortable': true,
                    'width': '25%',
                    'target': [2]
                },
                {
                    'sortable': false,
                    'width': '5%',
                    'target': [3]
                },
                {
                    'sortable': false,
                    'width': '5%',
                    'target': [4]
                }
            ],
            buttons: [
                {
                    extend: 'csv',
                    title: this.translate.instant('holidays.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('csv');
                    }
                }, {
                    extend: 'excel',
                    title: this.translate.instant('holidays.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('xlsx');
                    }
                }, {
                    extend: 'pdf',
                    title: this.translate.instant('holidays.title'),
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
                this.http
                    .post<DatatablesResponse>(that.apiUrl + '/api/all-holidays', dataTablesParameters, {})
                    .subscribe(resp => {
                        if (resp) {
                            this.holidays = resp.data;
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
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('holidays.title')).subscribe(() => {
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

                if (this.holidays.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    holidayYearChange($event: any) {
        this.getHolidays(moment($event).format('YYYY'));
    }

    openHolidayCreateModal() {
        this.modalRef = this.modalService.show(CreateHolidayModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getHolidays(moment(this.year).format('YYYY'));
            this.rerender();
        });
    }

    openHolidayEditModal(holiday) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                holiday: holiday
            }
        };
        this.modalRef = this.modalService.show(EditHolidayModalComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
            this.getHolidays(moment(this.year).format('YYYY'));
            this.rerender();
        });
    }

    removeHoliday(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.holidayService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('holidays.messages.delete'), this.translate.instant('holidays.title'));
                            this.getHolidays(moment(this.year).format('YYYY'));
                            this.rerender();
                        });
            }
        });
    }

    saveHolidayDetail(key, index, name, value) {
        this.holidayLists.years[key][index][name] = value;
        this.holidayService.update(this.holidayLists.years[key][index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('holidays.messages.update'), this.translate.instant('holidays.title'));
                    this.getHolidays(moment(this.year).format('YYYY'));
                });
    }

    saveHolidayListDetail(index, name, value) {
        if (value instanceof Date) {
            value = this.datePipe.transform(value, 'yyyy-MM-dd h:mm:ss a');
        }

        this.holidays[index][name] = value;
        this.holidayService.update(this.holidays[index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('holidays.messages.update'), this.translate.instant('holidays.title'));
                    this.rerender();
                });
    }

}
