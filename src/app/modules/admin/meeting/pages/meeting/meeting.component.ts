import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {MeetingService} from '../../../../../core/services/meeting.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {CreateMeetingModalComponent} from '../../components/create-meeting-modal/create-meeting-modal.component';
import {EditMeetingModalComponent} from '../../components/edit-meeting-modal/edit-meeting-modal.component';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {meeting_status_key_value} from '../../../../../core/helpers/admin.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-meeting',
    templateUrl: './meeting.component.html',
    styleUrls: ['./meeting.component.scss'],
    providers: [DatePipe]
})

export class MeetingComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    countStatus: any;
    statusfilterId: number;
    meetings = [];
    members = [];
    meetingstatusKeyValue = meeting_status_key_value;
    isPageLoaded = false;
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'meeting_table',
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
        private datePipe: DatePipe,
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private meetingService: MeetingService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.loadMeetingDatatable();
    }

    loadMeetingDatatable() {
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
                    'width': '9%',
                    'target': [0]
                },
                {
                    'sortable': true,
                    'width': '20%',
                    'target': [1]
                },
                {
                    'sortable': true,
                    'width': '8%',
                    'target': [2]
                },
                {
                    'sortable': false,
                    'width': '15%',
                    'target': [3]
                },
                {
                    'sortable': true,
                    'width': '14%',
                    'target': [4]
                },
                {
                    'sortable': true,
                    'width': '14%',
                    'target': [5]
                },
                {
                    'sortable': true,
                    'width': '5%',
                    'target': [6]
                },
                {
                    'sortable': true,
                    'width': '10%',
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
                    title: this.translate.instant('meetings.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('csv');
                    }
                }, {
                    extend: 'excel',
                    title: this.translate.instant('meetings.title'),
                    className: 'btn btn-datatable-gredient',
                    action: function (e, dt, node, config) {
                        that.exportFiles('xlsx');
                    }
                }, {
                    extend: 'pdf',
                    title: this.translate.instant('meetings.title'),
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
                    statusId: this.statusfilterId,
                };
                this.http
                    .post<DatatablesResponse>(that.apiUrl + '/api/all-meetings', dataTablesParameters, {})
                    .subscribe(resp => {
                        if (resp) {
                            this.meetings = resp.data;
                            this.countStatus = resp;
                            this.countStatus = this.countStatus.statusCount;
                            this.isPageLoaded = true;
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

    filterByStatus(statusID) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate(['meetings', statusID]);
    }

    exportFiles(type) {
        this.exportAsConfig.type = type;
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('meetings.title')).subscribe(() => {
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

                if (this.meetings.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    openMeetingCreateModal() {
        this.modalRef = this.modalService.show(CreateMeetingModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    openMeetingEditModal(meeting) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                meeting: meeting
            }
        };
        this.modalRef = this.modalService.show(EditMeetingModalComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    removeMeeting(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.meetingService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('meetings.messages.delete'), this.translate.instant('meetings.title'));
                            this.rerender();
                        });
            }
        });
    }

    saveMeetingDetail(index, name, value) {
        if (value instanceof Date) {
            value = this.datePipe.transform(value, 'yyyy-MM-dd h:mm:ss a');
        }

        this.meetings[index][name] = value;
        for (let iRow in this.meetings[index].members) {
            this.members.push(this.meetings[index].members[iRow].member_id);
        }

        this.meetings[index].members = this.members;
        this.meetingService.update(this.meetings[index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('meetings.messages.update'), this.translate.instant('meetings.title'));
                    this.rerender();
                }, error => {
                    this.rerender();
                });
    }

    getTranslateStatus(statusKey) {
        return this.meetingstatusKeyValue[statusKey];
    }

    changeMeetingStatus(meetingIDs: any, status: any) {
        let params = {
            ids: meetingIDs,
            status: status.id
        };
        this.meetingService.changeStatus(params).subscribe(data => {
            this.toastr.success(this.translate.instant('meetings.messages.status'), this.translate.instant('meetings.title'));
            this.rerender();
        });
    }

}
