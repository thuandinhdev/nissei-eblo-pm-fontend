import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {TranslateService} from '@ngx-translate/core';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';

import {IncidentService} from './../../../../../core/services/incident.service';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-user-incidents',
    templateUrl: './user-incidents.component.html',
    styleUrls: ['./user-incidents.component.scss']
})

export class UserIncidentsComponent implements OnInit {
    @Input() loginUser: any;
    @Input() apiUrl;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    incidents = [];
    userId = this.route.snapshot.paramMap.get('id');
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'incidents_table',
    };

    constructor(
        public translate: TranslateService,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private incidentService: IncidentService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.loadDatatable();
    }

    loadDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            select: true,
            order: [0],
            columns: [{
                'sortable': true,
                'width': '7%',
                'target': [0]
            }, {
                'sortable': true,
                'target': [1]
            }, {
                'sortable': true,
                'width': '12%',
                'target': [2]
            }, {
                'sortable': true,
                'width': '12%',
                'target': [3]
            }, {
                'sortable': true,
                'width': '11%',
                'target': [4]
            }, {
                'sortable': true,
                'width': '10%',
                'target': [5]
            }, {
                'sortable': true,
                'width': '10%',
                'target': [6]
            }],
            buttons: [{
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
            }],
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
                    isUserProfile: 1,
                    user_id: this.userId
                };
                this.http.post<DatatablesResponse>(this.apiUrl + '/api/all-incident', dataTablesParameters, {}).subscribe(resp => {
                    this.incidents = resp.data;
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
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('incidents.title')).subscribe(() => {
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
            });
        });
    }

}
