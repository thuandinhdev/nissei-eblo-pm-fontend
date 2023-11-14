import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataTableDirective} from 'angular-datatables';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-user-activities',
    templateUrl: './user-activities.component.html',
    styleUrls: ['./user-activities.component.scss']
})

export class UserActivitiesComponent implements OnInit {
    @Input() user: any;
    @Input() loginUser: any;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    activities = [];
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'activities_table',
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private toastr: ToastrService
    ) {
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
            // order: [0],
            columns: [{
                'sortable': true,
                'width': '18%',
                'target': [0]
            }, {
                'sortable': true,
                'width': '20%',
                'target': [1]
            }, {
                'sortable': true,
                'width': '62%',
                'target': [3]
            }
            ],
            buttons: [
                // {
                //     extend: 'csv',
                //     title: this.translate.instant('activities.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('csv');
                //     }
                // }, {
                //     extend: 'excel',
                //     title: this.translate.instant('activities.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('xlsx');
                //     }
                // }, {
                //     extend: 'pdf',
                //     title: this.translate.instant('activities.title'),
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
                dataTablesParameters.userId = this.user.id;
                this.http
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-activities', dataTablesParameters, {})
                    .subscribe(resp => {
                        if (resp) {
                            this.activities = resp.data;
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
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('activities.title')).subscribe(() => {
        });
    }

    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
    }
}
