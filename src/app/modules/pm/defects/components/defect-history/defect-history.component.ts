import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {UserService} from '../../../../../core/services/user.service';

@Component({
    selector: 'app-defect-history',
    templateUrl: './defect-history.component.html',
    styleUrls: ['./defect-history.component.scss']
})

export class DefectHistoryComponent implements OnInit {
    @Input() defect;
    @Input() loginUser: any;
    @Input() apiUrl;
    dtOptions: any = {};
    userData = [];
    userLists = [];

    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
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
            pagingType: 'full_numbers',
            pageLength: that.loginUser.settings.tables_pagination_limit,
            serverSide: false,
            processing: false,
            dom: '<"html5buttons"B>ltfrtip',
            order: [0],
            buttons: [{
                extend: 'csv',
                title: this.translate.instant('histories.title'),
                className: 'btn btn-datatable-gredient',
            }, {
                extend: 'excel',
                title: this.translate.instant('histories.title'),
                className: 'btn btn-datatable-gredient',
            }, {
                extend: 'pdf',
                title: this.translate.instant('histories.title'),
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
            }
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
