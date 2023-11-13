import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ActivatedRoute, Router} from '@angular/router';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {AppointmentsService} from '../../../../../core/services/appointments.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {CreateAppointmentComponent} from '../../components/create-appointment/create-appointment.component';
import {EditAppointmentComponent} from '../../components/edit-appointment/edit-appointment.component';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {appointment_status_key_value} from './../../../../../core/helpers/crm-helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-appointments-list',
    templateUrl: './appointments-list.component.html',
    styleUrls: ['./appointments-list.component.scss']
})

export class AppointmentsListComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    appointments = [];
    loginUser: any;
    statusCount: any;
    statusfilterId: number;
    appointmentStatusKeyValue = appointment_status_key_value;
    isPageLoaded = false;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'appointments_table',
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private appointmentsService: AppointmentsService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadAppointmentDatatable();
    }

    loadAppointmentDatatable() {
        this.statusfilterId = 0;
        if (this.route.snapshot.params['statusId']) {
            this.statusfilterId = this.route.snapshot.params['statusId'];
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
                    'target': [0]
                },
                {
                    'sortable': true,
                    'width': '15%',
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
                    'width': '12%',
                    'target': [4]
                },
                {
                    'sortable': true,
                    'width': '12%',
                    'target': [5]
                },
                {
                    'sortable': false,
                    'target': [6],
                    'width': '5%'
                }
            ],
            buttons: [
                {
                    extend: 'csv',
                    title: this.translate.instant('appointments.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('csv');
                    }
                }, {
                    extend: 'excel',
                    title: this.translate.instant('appointments.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('xlsx');
                    }
                }, {
                    extend: 'pdf',
                    title: this.translate.instant('appointments.title'),
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
                    status: this.statusfilterId
                };
                this.http
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-appointments', dataTablesParameters, {})
                    .subscribe(resp => {
                        this.isPageLoaded = true;
                        this.appointments = resp.data;
                        this.statusCount = resp;
                        this.statusCount = this.statusCount.statusCount;

                        callback({
                            recordsTotal: resp.recordsTotal,
                            recordsFiltered: resp.recordsFiltered,
                            data: [],
                        });
                    });
            }
        };
    }

    filterByStatus(statusID) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate(['appointments', statusID]);
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

                if (this.appointments.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('appointments.title')).subscribe(() => {
        });
    }

    openAppointmentCreateModal() {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn'
        };
        this.modalRef = this.modalService.show(CreateAppointmentComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    openAppointmentEditModal(appointment) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                appointment: appointment
            }
        };

        this.modalRef = this.modalService.show(EditAppointmentComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    deleteAppointment(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.appointmentsService.delete(id).subscribe(data => {
                    this.toastr.success(this.translate.instant('appointments.messages.delete'), this.translate.instant('appointments.title'));
                    this.rerender();
                });
            }
        });
    }

    getTranslateStatus(statusKey) {
        return this.appointmentStatusKeyValue[statusKey];
    }

    changeAppointmentStatus(appointmentId: any, status: any) {
        this.appointmentsService.changeStatus({id: appointmentId, status: status.id}).subscribe(data => {
            this.toastr.success(this.translate.instant('appointments.messages.status'), this.translate.instant('appointments.title'));
            this.rerender();
        });
    }

}
