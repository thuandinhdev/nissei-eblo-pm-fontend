import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {AnnouncementService} from '../../../../../core/services/announcement.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-announcement',
    templateUrl: './announcement.component.html',
    styleUrls: ['./announcement.component.scss'],
    providers: [DatePipe]
})

export class AnnouncementComponent implements OnInit {
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    announcements = [];
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'announcement_table',
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private datePipe: DatePipe,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private announcementService: AnnouncementService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadAnnouncementDatatable();
    }

    getCheckPermission(annoucement) {
        let role = this.ngxRolesService.getRole('admin');

        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            return true;
        } else if (this.loginUser.id == annoucement.user_id) {
            return true;
        } else {
            return false;
        }
    }

    loadAnnouncementDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            columns: [
                {
                    'sortable': false,
                    'width': '1%',
                    'target': [0]
                },
                {
                    'sortable': true,
                    'width': '50%',
                    'target': [1]
                },
                {
                    'sortable': true,
                    'width': '18%',
                    'target': [2]
                },
                {
                    'sortable': true,
                    'width': '18%',
                    'target': [3]
                },
                {
                    'sortable': true,
                    'width': '18%',
                    'target': [4]
                },
                {
                    'sortable': true,
                    'width': '10%',
                    'target': [5]
                },
                {
                    'sortable': false,
                    'width': '5%',
                    'target': [6]
                }
            ],
            buttons: [
                {
                    extend: 'csv',
                    title: this.translate.instant('announcements.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('csv');
                    }
                }, {
                    extend: 'excel',
                    title: this.translate.instant('announcements.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('xlsx');
                    }
                }, {
                    extend: 'pdf',
                    title: this.translate.instant('announcements.title'),
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
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-announcements', dataTablesParameters, {})
                    .subscribe(resp => {
                        if (resp) {
                            this.announcements = resp.data;
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
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('announcements.title')).subscribe(() => {
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

                if (this.announcements.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    deleteAnnouncement(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.announcementService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('announcements.messages.delete'), this.translate.instant('announcements.title'));
                            this.rerender();
                        });
            }
        });
    }

    saveAnnouncementDetail(index, name, value) {
        if (value instanceof Date) {
            value = this.datePipe.transform(value, 'yyyy-MM-dd h:mm:ss a');
        }

        this.announcements[index][name] = value;
        this.announcementService.update(this.announcements[index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('announcements.messages.update'), this.translate.instant('announcements.title'));
                    this.rerender();
                });
    }

}
