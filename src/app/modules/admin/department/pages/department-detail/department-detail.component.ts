import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {DepartmentService} from '../../../../../core/services/department.service';

import {loadDepartmentMenu} from '../../../../../core/helpers/app.helper';

import * as _ from 'lodash';

@Component({
    selector: 'app-department-detail',
    templateUrl: './department-detail.component.html',
    styleUrls: ['./department-detail.component.scss']
})

export class DepartmentDetailComponent implements OnInit {
    departmentInfo: any;
    expandedIndex: number;
    departmentId: number;
    roleId: number;
    isDepartmentLoaded = false;

    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private toastr: ToastrService,
        private departmentService: DepartmentService
    ) {
        this.route.paramMap.subscribe(params => {
            this.getDepartments(params.get('id'), params.get('roleId'));
        });
    }

    ngOnInit() {
    }

    getDepartments(departmentId, roleId) {
        this.departmentId = departmentId;
        this.roleId = roleId;
        this.departmentService.getDepartmentDetail(departmentId, roleId)
            .subscribe(
                data => {
                    this.isDepartmentLoaded = true;
                    this.departmentInfo = data;
                    setTimeout(() => {
                        loadDepartmentMenu();
                    });
                });
    }

    selectAllPermissions(event) {
        $(':checkbox').prop('checked', event.target.checked);
    }

    selectAllViewPermissions(event) {
        let that = this;
        $('.view input').prop('checked', event.target.checked);

        // --
        // All parent/nested parent selected
        if ($('.view input').prop('checked') == true) {
            that.checkParentPermission(1);
        } else {
            that.uncheckParentPermission(1, 2);
        }
    }

    selectAllCreatePermissions(event) {
        let that = this;
        $('.create input').prop('checked', event.target.checked);

        // --
        // All parent/nested parent selected
        if ($('.create input').prop('checked') == true) {
            that.checkParentPermission(1);
        } else {
            that.uncheckParentPermission(1, 3);
        }
    }

    selectAllEditPermissions(event) {
        let that = this;
        $('.edit input').prop('checked', event.target.checked);

        // --
        // All parent/nested parent selected
        if ($('.edit input').prop('checked') == true) {
            that.checkParentPermission(1);
        } else {
            that.uncheckParentPermission(1, 4);
        }
    }

    selectAllDeletePermissions(event) {
        let that = this;
        $('.delete input').prop('checked', event.target.checked);

        // --
        // All parent/nested parent selected
        if ($('.delete input').prop('checked') == true) {
            that.checkParentPermission(1);
        } else {
            that.uncheckParentPermission(1, 5);
        }
    }

    // --
    // Check permissions
    checkParentPermission(key) {
        // --
        // Parent
        $('.parent').each(function () {
            $(this).parent().parent().children('td').eq(key).find('input').prop('checked', true);
        });

        // --
        // Nested parent
        $('.nested_parent').each(function () {
            $(this).parent().parent().children('td').eq(key).find('input').prop('checked', true);
        });

        // --
        // Nested parent child
        $('.nested_parent_child').each(function () {
            $(this).parent().parent().children('td').eq(key).find('input').prop('checked', true);
        });
    }

    // --
    // Uncheck permissions
    uncheckParentPermission(key, key1) {
        // --
        // Parent
        $('.parent').each(function () {
            if ($(this).parent().parent().find('input:checked').not($(this).parent().parent().children('td').eq(key).find('input')).not($(this).parent().parent().children('td').eq(key1).find('input')).length == 0) {
                $(this).parent().parent().children('td').eq(key).find('input').prop('checked', false);
            }
        });

        // --
        // Nested parent
        $('.nested_parent').each(function () {
            if ($(this).parent().parent().find('input:checked').not($(this).parent().parent().children('td').eq(key).find('input')).not($(this).parent().parent().children('td').eq(key1).find('input')).length == 0) {
                $(this).parent().parent().children('td').eq(key).find('input').prop('checked', false);
            }
        });

        // --
        // Nested parent child
        $('.nested_parent_child').each(function () {
            if ($(this).parent().parent().find('input:checked').not($(this).parent().parent().children('td').eq(key).find('input')).not($(this).parent().parent().children('td').eq(key1).find('input')).length == 0) {
                $(this).parent().parent().children('td').eq(key).find('input').prop('checked', false);
            }
        });
    }

    getPermissionChecked(permissionKey, key) {
        if (this.departmentInfo.permissions[permissionKey]) {
            switch (key) {
                case 'view':
                    return this.departmentInfo.permissions[permissionKey].view == permissionKey;
                    break;
                case 'created':
                    return this.departmentInfo.permissions[permissionKey].created == permissionKey;
                    break;
                case 'edited':
                    return this.departmentInfo.permissions[permissionKey].edited == permissionKey;
                    break;
                case 'deleted':
                    return this.departmentInfo.permissions[permissionKey].deleted == permissionKey;
                    break;
                default:
                    return this.departmentInfo.permissions[permissionKey].id == permissionKey;
                    break;
            }
        } else {
            return false;
        }
    }

    isObjectEmpty(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    expandRow(index: number): void {
        this.expandedIndex = index === this.expandedIndex ? -1 : index;
    }

    saveDepartment() {

        // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // this.router.navigate(['departments']);
        // return;

        let submenu = [],
            menu = [],
            childMenu = [],
            finalSubmenus = [];

        if ($('form#departmentForm').serializeArray()) {
            submenu = $('form#departmentForm').serializeArray();
        }

        $('.menus_selected input:checkbox:checked').map(function () {
            menu.push($(this).val());
        }).get();

        $('.child input:checkbox:checked').map(function () {
            childMenu.push($(this).val());
        }).get();

        // --
        // Submenus
        if (submenu) {
            for (let iRow in submenu) {
                if (!finalSubmenus[submenu[iRow].value]) {
                    finalSubmenus[submenu[iRow].value] = {
                        'view': 0,
                        'created': 0,
                        'edited': 0,
                        'deleted': 0
                    };
                }
                if (submenu[iRow].name.indexOf('view') == 0) {
                    finalSubmenus[submenu[iRow].value].view = parseInt(submenu[iRow].value);
                }
                if (submenu[iRow].name.indexOf('create') == 0) {
                    finalSubmenus[submenu[iRow].value].created = parseInt(submenu[iRow].value);
                }
                if (submenu[iRow].name.indexOf('edit') == 0) {
                    finalSubmenus[submenu[iRow].value].edited = parseInt(submenu[iRow].value);
                }
                if (submenu[iRow].name.indexOf('delete') == 0) {
                    finalSubmenus[submenu[iRow].value].deleted = parseInt(submenu[iRow].value);
                }
            }
        }

        this.departmentService.updateDepartmentDetail(
            this.departmentId,
            this.roleId,
            {'menu': _.union(menu, childMenu), 'submenu': finalSubmenus}
        ).subscribe(
            data => {
                this.toastr.success(this.translate.instant('departments.messages.update'), this.translate.instant('departments.title'));
                this.router.navigate(['departments']);
            });
    }
}
