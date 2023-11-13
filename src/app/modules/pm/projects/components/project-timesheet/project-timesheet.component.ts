import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {NgxRolesService} from 'ngx-permissions';
import {ToastrService} from 'ngx-toastr';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {TimesheetService} from '../../../../../core/services/timesheet.service';

import {ProjectTimesheetEditModalComponent} from '../../components/project-timesheet-edit-modal/project-timesheet-edit-modal.component';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';

@Component({
    selector: 'app-project-timesheet',
    templateUrl: './project-timesheet.component.html',
    styleUrls: ['./project-timesheet.component.scss']
})
export class ProjectTimesheetComponent implements OnInit {
    @Input() project;
    @Input() apiUrl;
    @Input() loginUser: any;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    public modalRef: BsModalRef;
    dtOptions: any = {};
    timesheets = [];
    isPageLoaded = false;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'timesheets_table',
    };

    constructor(
        public translate: TranslateService,
        private http: HttpClient,
        private toastr: ToastrService,
        private exportAsService: ExportAsService,
        public ngxRolesService: NgxRolesService,
        private modalService: BsModalService,
        private timesheetService: TimesheetService,
    ) {
    }

    ngOnInit() {
        this.loadTimesheetDatatable();
    }

    loadTimesheetDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            order: [3],
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
                    project_ids: this.project.id,
                };
                this.http.post<DatatablesResponse>(this.apiUrl + '/api/project-timesheets', dataTablesParameters, {}).subscribe(resp => {
                    this.isPageLoaded = true;
                    this.timesheets = resp.data;
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
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('timesheet.title')).subscribe(() => {
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
            this.dtTrigger.next();
        });
    }

    getCheckPermission(timesheet) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            return true;
        } else if (timesheet.created_user_id == this.loginUser.id) {
            return true;
        } else {
            return false;
        }
    }

    saveTimesheetDetail(index, name, value) {
        this.timesheets[index][name] = value;
        this.timesheetService.update(this.timesheets[index]).subscribe(data => {
            this.toastr.success(this.translate.instant('timesheet.messages.update'), this.translate.instant('timesheet.title'));
            this.rerender();
        });
    }

    editTimesheet(timesheet) {
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
        this.modalRef = this.modalService.show(ProjectTimesheetEditModalComponent, modalConfigs);
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
}
