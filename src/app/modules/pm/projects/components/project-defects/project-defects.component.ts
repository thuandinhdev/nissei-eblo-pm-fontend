import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-project-defects',
    templateUrl: './project-defects.component.html',
    styleUrls: ['./project-defects.component.scss']
})

export class ProjectDefectsComponent implements OnInit {
    @Input() project;
    @Input() loginUser: any;
    @Input() apiUrl;
    dtOptions: any = {};

    constructor(public translate: TranslateService) {
    }

    ngOnInit() {
        this.loadDatatable();
    }

    loadDatatable() {
        let that = this;
        this.dtOptions = {
            dom: '<"html5buttons"B>lTfgtip',
            pagingType: 'full_numbers',
            paging: true,
            pageLength: that.loginUser.settings.tables_pagination_limit,
            responsive: false,
            autoWidth: false,
            order: [0],
            buttons: [{
                extend: 'csv',
                title: this.translate.instant('defects.title'),
                className: 'btn btn-datatable-gredient',
            }, {
                extend: 'excel',
                title: this.translate.instant('defects.title'),
                className: 'btn btn-datatable-gredient',
            }, {
                extend: 'pdf',
                title: this.translate.instant('defects.title'),
                className: 'btn btn-datatable-gredient',
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
            columnDefs: [
                {width: '9%', targets: [0]},
                {width: '41%', targets: [1]},
                {width: '10%', targets: [2]},
                {width: '10%', targets: [3]},
                {width: '10%', targets: [4]},
                {width: '10%', targets: [5]},
                {width: '10%', targets: [6]}
            ]
        };
    }

}
