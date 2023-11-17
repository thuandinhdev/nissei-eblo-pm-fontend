import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {DataTableDirective} from 'angular-datatables';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {TranslateService} from '@ngx-translate/core';
import {NgxRolesService} from 'ngx-permissions';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {UserService} from '../../../../../core/services/user.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {ImportUserComponent} from '../../components/import-user/import-user.component';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {UserAvatars} from '../../../../../core/helpers/admin.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    assignUserPermissions: any;
    users = [];
    departments = [];
    departments_roles = [];
    avatars = UserAvatars;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'users_table',
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
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        this.getAssignUserPermissions();
    }

    ngOnInit() {
        this.loadUserDatatable();
    }

    loadUserDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            // order: [1, 'asc'],
            dom: '<"html5buttons"B>ltfrtip',
            // columns: [
            //     {
            //         'sortable': false,
            //         'width': '1%',
            //         'target': [0]
            //     },
            //     {
            //         'sortable': true,
            //         'target': [1]
            //     },
            //     {
            //         'sortable': true,
            //         'target': [2]
            //     },
            //     {
            //         'sortable': true,
            //         'target': [3]
            //     },
            //     {
            //         'sortable': true,
            //         'width': '8%',
            //         'target': [4]
            //     },
            //     {
            //         'sortable': false,
            //         'width': '30%',
            //         'target': [5]
            //     },
            //     {
            //         'sortable': false,
            //         'width': '5%',
            //         'target': [6]
            //     }
            // ],
            buttons: [
                // {
                //     extend: 'csv',
                //     title: this.translate.instant('users.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('csv');
                //     }
                // }, {
                //     extend: 'excel',
                //     title: this.translate.instant('users.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('xlsx');
                //     }
                // }, {
                //     extend: 'pdf',
                //     title: this.translate.instant('users.title'),
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
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-users', dataTablesParameters, {})
                    .subscribe(resp => {
                        if (resp) {
                            this.users = resp.data;
                            this.loadUserDepartments();
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

                if (this.users.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('users.title')).subscribe(() => {
        });
    }

    loadUserDepartments() {
        for (let iRow in this.users) {
            this.checkUserHavePermission(iRow, this.users[iRow].permission);

            for (let jRow in this.users[iRow].roles) {
                for (let kRow in this.users[iRow].roles[jRow].user_departments) {
                    if ((this.users[iRow].roles[jRow].user_departments[kRow].pivot.role_id == this.users[iRow].roles[jRow].id) && (this.users[iRow].roles[jRow].user_departments[kRow].pivot.user_id == this.users[iRow].id)) {
                        if (!this.departments_roles[this.users[iRow].roles[jRow].user_departments[kRow].pivot.user_id + '_' + this.users[iRow].roles[jRow].user_departments[kRow].pivot.role_id + '_' + this.users[iRow].roles[jRow].user_departments[kRow].pivot.department_id]) {
                            this.departments_roles[this.users[iRow].roles[jRow].user_departments[kRow].pivot.user_id + '_' + this.users[iRow].roles[jRow].user_departments[kRow].pivot.role_id + '_' + this.users[iRow].roles[jRow].user_departments[kRow].pivot.department_id] = [];
                            if (!this.departments[this.users[iRow].id]) {
                                this.departments[this.users[iRow].id] = [];
                            }

                            this.departments[this.users[iRow].id].push({
                                user_id: this.users[iRow].roles[jRow].user_departments[kRow].pivot.user_id,
                                role_id: this.users[iRow].roles[jRow].user_departments[kRow].pivot.role_id,
                                department_id: this.users[iRow].roles[jRow].user_departments[kRow].pivot.department_id,
                                role_name: this.users[iRow].roles[jRow].name,
                                department_name: this.users[iRow].roles[jRow].user_departments[kRow].name
                            });
                        }
                    }
                }
            }
        }
    }

    getAssignUserPermissions() {
        this.userService.getUserPermissions()
            .subscribe(
                data => {
                    this.assignUserPermissions = data;
                });
    }

    setActiveDeactiveUser(value: boolean, user) {

        // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // return;

        user.is_active = value;
        this.userService.setActiveDeactiveUser(user)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('users.messages.status'), this.translate.instant('users.title'));
                    this.rerender();
                }, error => {
                    this.rerender();
                });
    }

    sendInviteUserMail(id) {
        this.userService.sendInviteUserMail(id)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('users.messages.invite'), this.translate.instant('users.title'));
                    this.rerender();
                });
    }

    checkUserHavePermission(iRow, userPermissions) {
        let roleName = this.ngxRolesService.getRole('admin');
        let allowedPermission = {
            isEditable: false,
            isDeletable: false
        };

        if (roleName && roleName.name == 'admin' || this.loginUser.is_super_admin) {
            allowedPermission = {
                isEditable: true,
                isDeletable: true
            };
        }

        if (!userPermissions) {
            allowedPermission = {
                isEditable: false,
                isDeletable: false
            };
        } else {
            if (userPermissions == 'all') {
                // for (let iRow in this.assignUserPermissions) {
                //     if (this.assignUserPermissions[iRow].id == this.loginUser.id) {
                //         allowedPermission = {
                //             isEditable: true,
                //             isDeletable: true
                //         };
                //     }
                // }
            } else {
                let loginUserPermissions = JSON.parse(userPermissions);

                if (loginUserPermissions[this.loginUser.id]) {
                    for (let iRow in loginUserPermissions[this.loginUser.id]) {
                        if (loginUserPermissions[this.loginUser.id][iRow] == 'edit') {
                            allowedPermission.isEditable = true;
                        }
                        if (loginUserPermissions[this.loginUser.id][iRow] == 'delete') {
                            allowedPermission.isDeletable = true;
                        }
                    }
                }
            }
        }

        this.users[iRow].department_role_perm = allowedPermission;
    }

    openUserImportModal() {
        this.modalRef = this.modalService.show(ImportUserComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.toastr.success(this.translate.instant('users.messages.import'), this.translate.instant('users.title'));
            this.rerender();
        });
    }

    userDelete(userId) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text2'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {

                // --
                // this.toastr.error(this.translate.instant('common.not_allowed'));
                // return;

                this.userService.delete(userId, {'UserAvatars': this.avatars}).subscribe(data => {
                    this.toastr.success(this.translate.instant('users.messages.delete'), this.translate.instant('users.title'));
                    this.rerender();
                });
            }
        });
    }

    saveUserDetail(index, name, value) {
        this.users[index][name] = value;
        this.users[index]['type'] = 'list';
        this.userService.update(this.users[index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('users.messages.update'), this.translate.instant('users.title'));
                    this.rerender();
                });
    }
}
