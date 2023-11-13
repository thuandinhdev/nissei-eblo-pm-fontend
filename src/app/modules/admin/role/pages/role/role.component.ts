import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {RoleService} from '../../../../../core/services/role.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {CreateRoleModalComponent} from '../../components/create-role-modal/create-role-modal.component';
import {EditRoleModalComponent} from '../../components/edit-role-modal/edit-role-modal.component';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-role',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss']
})

export class RoleComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    roles = [];
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'role_table',
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
        public ngxRolesService: NgxRolesService,
        private http: HttpClient,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private exportAsService: ExportAsService,
        private authenticationService: AuthenticationService,
        private roleService: RoleService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadRoleDatatable();
    }

    loadRoleDatatable() {
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
                'sortable': true,
                'target': [3]
            }, {
                'sortable': false,
                'width': '5%',
                'target': [4]
            }
            ],
            buttons: [
            //     {
            //     extend: 'csv',
            //     title: this.translate.instant('roles.title'),
            //     className: 'btn btn-datatable-gredient',
            //     action: function (e, dt, node, config) {
            //         that.exportFiles('csv');
            //     }
            // }, {
            //     extend: 'excel',
            //     title: this.translate.instant('roles.title'),
            //     className: 'btn btn-datatable-gredient',
            //     action: function (e, dt, node, config) {
            //         that.exportFiles('xlsx');
            //     }
            // }, {
            //     extend: 'pdf',
            //     title: this.translate.instant('roles.title'),
            //     className: 'btn btn-datatable-gredient',
            //     action: function (e, dt, node, config) {
            //         that.exportFiles('pdf');
            //     }
            // }
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
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-roles', dataTablesParameters, {})
                    .subscribe(resp => {
                        if (resp) {
                            this.roles = resp.data;
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
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('roles.title')).subscribe(() => {
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

                if (this.roles.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    getCheckRole(role) {
        let permission = false,
            rolePerm = this.ngxRolesService.getRole('admin');

        if (role.id == 1) {
            return false;
        }

        if (rolePerm.name == 'admin' || this.loginUser.is_super_admin) {
            return true;
        } else {
            return false;
        }
    }

    openRoleCreateModal() {
        this.modalRef = this.modalService.show(CreateRoleModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    openRoleEditModal(role) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                role: role
            }
        };

        this.modalRef = this.modalService.show(EditRoleModalComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    roleDelete(roleId) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.roleService.delete(roleId)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('roles.messages.delete'), this.translate.instant('roles.title'));
                            this.rerender();
                        });
            }
        });
    }

    saveRoleDetail(index, name, value) {
        this.roles[index][name] = value;
        this.roleService.update(this.roles[index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('roles.messages.update'), this.translate.instant('roles.title'));
                    this.rerender();
                });
    }

}
