import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {DataTableDirective} from 'angular-datatables';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {TeamService} from '../../../../../core/services/team.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {TeamCreateModalComponent} from '../../components/team-create-modal/team-create-modal.component';
import {TeamEditModalComponent} from '../../components/team-edit-modal/team-edit-modal.component';
import {ImportTeamComponent} from '../../components/import-team/import-team.component';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss']
})

export class TeamComponent implements OnInit {
    public modalRef: BsModalRef;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    loginUser: any;
    teams = [];
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'team_table',
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
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private toastr: ToastrService,
        private teamService: TeamService,
        private authenticationService: AuthenticationService
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
                'sortable': false,
                'width': '2%',
                'target': [0]
            }, {
                'sortable': true,
                'target': [1]
            }, {
                'sortable': false,
                'target': [2]
            }, {
                'sortable': true,
                'width': '5%',
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
            //     title: this.translate.instant('teams.title'),
            //     className: 'btn btn-datatable-gredient',
            //     action: function (e, dt, node, config) {
            //         that.exportFiles('csv');
            //     }
            // }, {
            //     extend: 'excel',
            //     title: this.translate.instant('teams.title'),
            //     className: 'btn btn-datatable-gredient',
            //     action: function (e, dt, node, config) {
            //         that.exportFiles('xlsx');
            //     }
            // }, {
            //     extend: 'pdf',
            //     title: this.translate.instant('teams.title'),
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
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-teams', dataTablesParameters, {})
                    .subscribe(resp => {
                        if (resp) {
                            this.teams = resp.data;
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
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('teams.title')).subscribe(() => {
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

                if (this.teams.length > 0) {
                    $('.tfoot_dt').addClass('d-none');
                } else {
                    $('.tfoot_dt').removeClass('d-none');
                }
            });
        });
    }

    openTeamCreateModal() {
        this.modalRef = this.modalService.show(TeamCreateModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    openTeamEditModal(team) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                team: team
            }
        };
        this.modalRef = this.modalService.show(TeamEditModalComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
            this.rerender();
        });
    }

    openTeamImportModal() {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered animated fadeIn'
        };
        this.modalRef = this.modalService.show(ImportTeamComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
            this.toastr.success(this.translate.instant('teams.messages.import'), this.translate.instant('teams.title'));
            this.rerender();
        });
    }

    removeTeam(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {

                // --
                // this.toastr.error(this.translate.instant('common.not_allowed'));
                // return;

                this.teamService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('teams.messages.delete'), this.translate.instant('teams.title'));
                            this.rerender();
                        });
            }
        });
    }

    saveTeamDetail(index, name, value) {
        this.teams[index][name] = value;

        let members = [];
        for (let iRow in this.teams[index].members) {
            members.push(this.teams[index].members[iRow].id);
        }

        let team = {
            id: this.teams[index].id,
            team_name: this.teams[index].team_name,
            members: members,
            team_leader: this.teams[index].team_leader,
            description: this.teams[index].description
        };

        this.teamService.update(team)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('teams.messages.update'), this.translate.instant('teams.title'));
                    this.rerender();
                });
    }

}
