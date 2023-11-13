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

import {IncidentService} from '../../../../../core/services/incident.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {incident_severity_key_value, incident_status_key_value} from './../../../../../core/helpers/pm-helper';
import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-incident-list',
    templateUrl: './incident-list.component.html',
    styleUrls: ['./incident-list.component.scss'],
    preserveWhitespaces: true
})

export class IncidentListComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    incidents = [];
    isPageLoaded = false;
    incidentstatusKeyValue = incident_status_key_value;
    incidentSeveritiesKeyValue = incident_severity_key_value;
    incidentFilterKey = 'selected';
    incidentCount: any;
    countStatus: any;
    statusfilterId: number;
    loginUser: any;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'incident_table',
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
        private http: HttpClient,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private incidentService: IncidentService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadIncidentDatatable();
    }

    getTranslateStatus(statusKey) {
        return this.incidentstatusKeyValue[statusKey];
    }

    getTranslatePriorities(statusKey) {
        return this.incidentSeveritiesKeyValue[statusKey];
    }

    loadIncidentDatatable() {
        this.statusfilterId = 0;
        if (this.route.snapshot.params['status']) {
            this.statusfilterId = this.route.snapshot.params['status'];
        }
        if (this.route.snapshot.params['incidentFilterKey']) {
            this.incidentFilterKey = this.route.snapshot.params['incidentFilterKey'];
        }

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
                    'target': [7],
                    'width': '10%'
                },
                {
                    'sortable': false,
                    'target': [8],
                    'width': '5%'
                }
            ],
            buttons: [
                {
                    extend: 'csv',
                    title: this.translate.instant('incidents.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('csv');
                    }
                }, {
                    extend: 'excel',
                    title: this.translate.instant('incidents.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('xlsx');
                    }
                }, {
                    extend: 'pdf',
                    title: this.translate.instant('incidents.title'),
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
                    status: this.statusfilterId,
                    filter: this.incidentFilterKey
                };
                this.http
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-incident', dataTablesParameters, {})
                    .subscribe(resp => {
                        this.isPageLoaded = true;
                        this.incidents = resp.data;
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

                if (this.incidents.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('incidents.title')).subscribe(() => {
        });
    }

    getCheckPermission(incident) {
        let role = this.ngxRolesService.getRole('admin');
        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            return true;
        } else if (incident.assign_to == this.loginUser.id || incident.create_user_id == this.loginUser.id) {
            return true;
        } else {
            return false;
        }
    }

    changeIncidentStatus(id: any, status: any) {
        let changeIncident = {
            id: id,
            status: status.id
        };
        this.incidentService.changeStatus(changeIncident)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('incidents.messages.status'), this.translate.instant('incidents.title'));
                    this.rerender();
                });
    }

    changeIncidentSeverity(incidentId: any, priority: any) {
        this.incidentService.changeSeverity({
            id: incidentId,
            priority: priority.id
        }).subscribe(
            data => {
                this.toastr.success(this.translate.instant('incidents.messages.priority'), this.translate.instant('incidents.title'));
                this.rerender();
            });
    }

    filterByStatus(statusID, incidentFilterKey) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate(['incidents', statusID, incidentFilterKey]);
    }

    deleteIncident(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.incidentService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('incidents.messages.delete'), this.translate.instant('incidents.title'));
                            this.rerender();
                        });
            }
        });
    }

    saveIncidentDetail(index, name, value) {
        this.incidents[index][name] = value;
        this.incidentService.update(this.incidents[index])
            .subscribe(data => {
                this.toastr.success(this.translate.instant('incidents.messages.update'), this.translate.instant('incidents.title'));
                this.rerender();
            })
    }

}
