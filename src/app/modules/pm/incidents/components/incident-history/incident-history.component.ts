import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {User} from './../../../../../shared/models/user.model';

import {UserService} from '../../../../../core/services/user.service';

import 'datatables.net';
import 'datatables.net-bs4';

@Component({
    selector: 'app-incident-history',
    templateUrl: './incident-history.component.html',
    styleUrls: ['./incident-history.component.scss']
})

export class IncidentHistoryComponent implements OnInit {
    @Input() incident;
    @Input() loginUser: any;
    @Input() apiUrl;
    dtOptions: any = {};
    userData: User[];
    userLists = [];

    constructor(
        public translate: TranslateService,
        private userService: UserService
    ) {
    }

    ngOnInit() {
        this.getUserIdName();
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
            order: [],
            buttons: [{
                extend: 'csv',
                title: this.translate.instant('histories.title'),
                className: 'btn btn-datatable-gredient'
            }, {
                extend: 'excel',
                title: this.translate.instant('histories.title'),
                className: 'btn btn-datatable-gredient'
            }, {
                extend: 'pdf',
                title: this.translate.instant('histories.title'),
                className: 'btn btn-datatable-gredient'
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
                {sortable: true, targets: [6]},
                {width: '8%', targets: [0]},
                {width: '30%', targets: [1]},
                {width: '8%', targets: [2]},
                {width: '8%', targets: [3]},
                {width: '8%', targets: [4]},
                {width: '8%', targets: [5]},
                {width: '10%', targets: [6]},
            ]
        };
    }

    getUserIdName() {
        this.userService.getUserIdName().subscribe(data => {
            this.userData = data;
            this.setUsers();
        });
    }

    setUsers() {
        this.userLists = [];
        for (let iRow in this.userData) {
            this.userLists[this.userData[iRow].id] = {
                'name': this.userData[iRow].firstname + ' ' + this.userData[iRow].lastname,
                'avatar': this.userData[iRow].avatar,
            };
        }
    }
}
