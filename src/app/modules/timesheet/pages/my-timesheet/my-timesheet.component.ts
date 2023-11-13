import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {TimesheetService} from '../../../../core/services/timesheet.service';
import {ProjectService} from '../../../../core/services/project.service';
import {ClientService} from '../../../../core/services/client.service';
import {AuthenticationService} from '../../../../core/services/authentication.service';

import {CreateTimesheetModalComponent} from '../../components/create-timesheet-modal/create-timesheet-modal.component';
import {EditTimesheetModalComponent} from '../../components/edit-timesheet-modal/edit-timesheet-modal.component';

import {DatatablesResponse} from '../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-my-timesheet',
    templateUrl: './my-timesheet.component.html',
    styleUrls: ['./my-timesheet.component.scss']
})

export class MyTimesheetComponent implements OnInit {
    public apiUrl = environment.apiUrl;
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    timesheetFilterForm: FormGroup;
    dtOptions: any = {};
    loginUser: any;
    totalHours: any;
    projects: any;
    timesheets = [];
    clients = [];
    isPageLoaded = false;
    isFormSubmitted = false;
    range = [
        {id: 'today', label: this.translate.instant('timesheet.range.today')},
        {id: 'this_month', label: this.translate.instant('timesheet.range.this_month')},
        {id: 'last_month', label: this.translate.instant('timesheet.range.last_month')},
        {id: 'this_week', label: this.translate.instant('timesheet.range.this_week')},
        {id: 'last_week', label: this.translate.instant('timesheet.range.last_week')},
        {id: 'period', label: this.translate.instant('timesheet.range.period')}
    ];
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'timesheets_table',
    };
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private timesheetService: TimesheetService,
        private projectService: ProjectService,
        private clientService: ClientService,
        private authenticationService: AuthenticationService,
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    get filterControl() {
        return this.timesheetFilterForm.controls;
    }

    ngOnInit() {
        this.getProjects();
        this.getClients();
        this.loadForms();
        this.loadTimesheetDatatable();
    }

    getProjects() {
        this.projectService.getMyProjects().subscribe(data => {
            this.projects = data;
        });
    }

    getClients() {
        this.clientService.getClientsWithTrashed().subscribe(data => {
            this.clients = data;
        });
    }

    loadForms() {
        this.timesheetFilterForm = this.formBuilder.group({
            range: [this.range[0].id, [Validators.required]],
            period_from: [null],
            period_to: [null],
            project_ids: [null],
            client_id: [null],
        });
    }

    rangeChange(event: any) {
        const fromControl = this.timesheetFilterForm.get('period_from');
        const toControl = this.timesheetFilterForm.get('period_to');
        if (event.id === 'period') {
            fromControl.setValidators([Validators.required]);
            toControl.setValidators([Validators.required]);
            $('.btn_apply').removeClass('d-none');
        } else {
            fromControl.clearValidators();
            toControl.clearValidators();
            $('.btn_apply').addClass('d-none');
            this.onSubmit();
        }
        fromControl.updateValueAndValidity();
        toControl.updateValueAndValidity();
    }

    periodFromDateChange(event: any) {
        this.timesheetFilterForm.patchValue({period_to: event});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.timesheetFilterForm.invalid) {
            return;
        }
        this.rerender();
    }

    loadTimesheetDatatable() {
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
                    'target': [0]
                },
                {
                    'sortable': false,
                    'target': [1]
                },
                {
                    'sortable': true,
                    'target': [2]
                },
                {
                    'sortable': true,
                    'target': [3]
                },
                {
                    'sortable': true,
                    'target': [4]
                },
                {
                    'sortable': true,
                    'target': [5]
                },
                {
                    'sortable': false,
                    'target': [6]
                }
            ],
            buttons: [
                {
                    extend: 'csv',
                    title: this.translate.instant('timesheet.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('csv');
                    }
                }, {
                    extend: 'excel',
                    title: this.translate.instant('timesheet.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('xlsx');
                    }
                }, {
                    extend: 'pdf',
                    title: this.translate.instant('timesheet.title'),
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
                    range: this.timesheetFilterForm.value.range,
                    period_from: this.timesheetFilterForm.value.period_from,
                    period_to: this.timesheetFilterForm.value.period_to,
                    project_ids: this.timesheetFilterForm.value.project_ids,
                    client_id: this.timesheetFilterForm.value.client_id,
                };
                this.http.post<DatatablesResponse>(this.apiUrl + '/api/my-timesheets', dataTablesParameters, {}).subscribe(resp => {
                    this.isPageLoaded = true;
                    that.timesheets = resp.data;
                    this.totalHours = resp;
                    this.totalHours = this.totalHours.total;
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: [],
                    });
                    setTimeout(() => {
                        this.setMessage();
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
                this.setMessage();
            }, 200);
        });
    }

    setMessage() {
        if (this.timesheets.length > 0) {
            $('.tfoot_dt').addClass('d-none');
        } else {
            $('.tfoot_dt').removeClass('d-none');
        }
    }

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('timesheet.title')).subscribe(() => {
        });
    }

    openTimesheetCreateModal() {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                params: {
                    module_id: 6,
                    module_related_id: null,
                    project_id: null
                }
            }
        };
        this.modalRef = this.modalService.show(CreateTimesheetModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    openTimesheetEditModal(timesheet) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                timesheet: timesheet
            }
        };
        this.modalRef = this.modalService.show(EditTimesheetModalComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    deleteTimesheet(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + this.translate.instant('timesheet.title').toLowerCase() + '!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.timesheetService.delete(id).subscribe(data => {
                    this.rerender();
                    this.toastr.success(this.translate.instant('timesheet.messages.delete'), this.translate.instant('timesheet.title'));
                });
            }
        });
    }

    saveTimesheetDetail(index, name, value) {
        this.timesheets[index][name] = value;
        this.timesheetService.update(this.timesheets[index]).subscribe(data => {
            this.toastr.success(this.translate.instant('timesheet.messages.update'), this.translate.instant('timesheet.title'));
            this.rerender();
        });
    }

}
