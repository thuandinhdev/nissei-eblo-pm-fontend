import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {ClientService} from '../../../../../core/services/client.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {UserAvatars} from '../../../../../core/helpers/admin.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss']
})

export class ClientComponent implements OnInit {
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    clients = [];
    departments = [];
    departments_roles = [];
    avatars = UserAvatars;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'clients_table',
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private clientService: ClientService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadClientDatatable();
    }

    loadClientDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            order: [1, 'asc'],
            dom: '<"html5buttons"B>ltfrtip',
            columns: [
                {
                    'sortable': false,
                    'width': '1%',
                    'target': [0]
                },
                {
                    'sortable': true,
                    'width': '10%',
                    'target': [1]
                },
                {
                    'sortable': true,
                    'width': '10%',
                    'target': [2]
                },
                {
                    'sortable': true,
                    'target': [3]
                },
                {
                    'sortable': false,
                    'target': [4]
                },
                {
                    'sortable': false,
                    'target': [5]
                },
                {
                    'sortable': true,
                    'target': [6]
                },
                {
                    'sortable': false,
                    'target': [7]
                },
                {
                    'sortable': false,
                    'width': '5%',
                    'target': [8]
                }
            ],
            buttons: [
                {
                    extend: 'csv',
                    title: this.translate.instant('clients.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('csv');
                    }
                }, {
                    extend: 'excel',
                    title: this.translate.instant('clients.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('xlsx');
                    }
                }, {
                    extend: 'pdf',
                    title: this.translate.instant('clients.title'),
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
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-clients', dataTablesParameters, {})
                    .subscribe(resp => {
                        this.clients = resp.data;
                        this.loadUserDepartments();

                        callback({
                            recordsTotal: resp.recordsTotal,
                            recordsFiltered: resp.recordsFiltered,
                            data: [],
                        });
                    });
            }
        };
    }

    loadUserDepartments() {
        for (let iRow in this.clients) {
            for (let jRow in this.clients[iRow].roles) {
                for (let kRow in this.clients[iRow].roles[jRow].userdepartments) {
                    if ((this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.role_id == this.clients[iRow].roles[jRow].id) && (this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.user_id == this.clients[iRow].id)) {
                        if (!this.departments_roles[this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.user_id + '_' + this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.role_id + '_' + this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.department_id]) {
                            this.departments_roles[this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.user_id + '_' + this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.role_id + '_' + this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.department_id] = [];
                            if (!this.departments[this.clients[iRow].id]) {
                                this.departments[this.clients[iRow].id] = [];
                            }

                            this.departments[this.clients[iRow].id].push({
                                user_id: this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.user_id,
                                role_id: this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.role_id,
                                department_id: this.clients[iRow].roles[jRow].userdepartments[kRow].pivot.department_id,
                                role_name: this.clients[iRow].roles[jRow].name,
                                department_name: this.clients[iRow].roles[jRow].userdepartments[kRow].name
                            });
                        }
                    }
                }
            }
        }
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
            });

            if (this.clients.length > 0) {
                $('.tfoot_dt').addClass('d-none');
            } else {
                $('.tfoot_dt').removeClass('d-none');
            }
        });
    }

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, 'clients').subscribe(() => {
        });
    }

    setActiveDeactiveUser(value: boolean, client) {

        // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // return;

        client.is_active = value;
        this.clientService.setActiveDeactiveUser(client)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('clients.messages.status'), this.translate.instant('clients.title'));
                    this.rerender();
                }, error => {
                    this.rerender();
                });
    }

    sendInviteUserMail(id) {
        this.clientService.sendInviteUserMail(id)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('clients.messages.invite'), this.translate.instant('clients.title'));
                    this.rerender();
                });
    }

    deleteClient(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text3'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {

                // --
                // this.toastr.error(this.translate.instant('common.not_allowed'));
                // return;

                this.clientService.delete(id, {'UserAvatars': this.avatars}).subscribe(data => {
                    this.toastr.success(this.translate.instant('clients.messages.delete'), this.translate.instant('clients.title'));
                    this.rerender();
                });
            }
        });
    }

    saveClientDetail(index, name, value) {
        this.clients[index][name] = value;
        this.clients[index]['type'] = 'list';
        this.clientService.update(this.clients[index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('clients.messages.update'), this.translate.instant('clients.title'));
                    this.rerender();
                });
    }

}
