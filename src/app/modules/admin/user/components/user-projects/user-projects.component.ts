import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {DataTableDirective} from 'angular-datatables';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {DatatablesResponse} from '../../../../../core/helpers/datatables-response.helper';
import {ProjectService} from './../../../../../core/services/project.service';

import {environment} from '../../../../../../environments/environment';

import 'datatables.net';
import 'datatables.net-bs4';

declare var $: any;

@Component({
    selector: 'app-user-projects',
    templateUrl: './user-projects.component.html',
    styleUrls: ['./user-projects.component.scss']
})

export class UserProjectsComponent implements OnInit {
    @Input() loginUser: any;
    @ViewChild(DataTableDirective, {static: true})
    dtElement: DataTableDirective;
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = {};
    projects = [];
    userId = this.route.snapshot.paramMap.get('id');
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'projects_table',
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private http: HttpClient,
        private exportAsService: ExportAsService,
        private projectService: ProjectService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.loadProjectDatatable();
    }

    loadProjectDatatable() {
        let that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: true,
            processing: true,
            dom: '<"html5buttons"B>ltfrtip',
            select: true,
            // order: [0],
            columns: [{
                'sortable': true,
                'width': '8%',
                'target': [0]
            }, {
                'sortable': true,
                'target': [1]
            }, {
                'sortable': true,
                'width': '11%',
                'target': [2]
            }, {
                'sortable': true,
                'width': '11%',
                'target': [3]
            }, {
                'sortable': true,
                'width': '11%',
                'target': [4]
            }, {
                'sortable': true,
                'width': '11%',
                'target': [5]
            }],
            buttons: [
                // {
                //     extend: 'csv',
                //     title: this.translate.instant('projects.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('csv');
                //     }
                // }, {
                //     extend: 'excel',
                //     title: this.translate.instant('projects.title'),
                //     className: 'btn btn-datatable-gredient',
                //     action: function (e, dt, node, config) {
                //         that.exportFiles('xlsx');
                //     }
                // }, {
                //     extend: 'pdf',
                //     title: this.translate.instant('projects.title'),
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
                this.http
                    .post<DatatablesResponse>(this.apiUrl + '/api/all-projects', dataTablesParameters, {})
                    .subscribe(resp => {
                        this.projects = resp.data;
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
        this.exportAsService.save(this.exportAsConfig, this.translate.instant('projects.title')).subscribe(() => {
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
