import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {NgxRolesService} from 'ngx-permissions';

import {UserService} from '../../../../../core/services/user.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})

export class UserDetailComponent implements OnInit {
    loginUser: any;
    assignUserPermissions: any;
    user: any;
    userActiveTab = '1';
    isPageLoaded = false;
    permission = false;
    private apiUrl = environment.apiUrl;

    constructor(
        public ngxRolesService: NgxRolesService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private userService: UserService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        this.route.paramMap.subscribe(params => {
            this.getUserById(params.get('id'));
        });
    }

    ngOnInit() {
    }

    setActiveUserTab($event) {
        this.userActiveTab = $event.id;
    }

    getActiveUserTab(tab) {
        return this.userActiveTab === tab;
    }

    checkUserHavePermission(user) {
        let roleName = this.ngxRolesService.getRole('admin');

        if ((roleName && roleName.name == 'admin') || this.loginUser.is_super_admin) {
            this.permission = true;
        } else if ((this.checkDepartmentsRoles(user) || user.is_super_admin) && user.id == this.loginUser.id) {
            this.permission = true;
        } else if ((this.checkDepartmentsRoles(user) || user.is_super_admin) && user.id != this.loginUser.id) {
            this.permission = false;
        } else if (user.id == this.loginUser.id) {
            this.permission = true;
        } else if (!user.permission) {
            this.permission = false;
        } else {
            if (user.permission == 'all') {
                for (let iRow in this.assignUserPermissions) {
                    if (this.assignUserPermissions[iRow].id == this.loginUser.id) {
                        this.permission = true;
                    }
                }
            } else {
                if (typeof user.permission == 'string') {
                    let loginUserPermissions = JSON.parse(user.permission);

                    if (loginUserPermissions[this.loginUser.id]) {
                        for (let iRow in loginUserPermissions[this.loginUser.id]) {
                            if (loginUserPermissions[this.loginUser.id][iRow] == 'edit') {
                                this.permission = true;
                            }
                        }
                    }
                } else {
                    this.permission = false;
                }
            }
        }

        this.isPageLoaded = true;
    }

    checkDepartmentsRoles(user) {
        let isAdmin = false;
        for (let iRow in user.departments) {
            for (let jRow in user.departments[iRow].roles) {
                if (user.departments[iRow].roles[jRow].id == 1) {
                    isAdmin = true;
                }
            }
        }
        return isAdmin;
    }

    getAssignUserPermissions() {
        this.userService.getUserPermissions()
            .subscribe(
                data => {
                    this.assignUserPermissions = data;
                    this.checkUserHavePermission(this.user);
                });
    }

    getUserById(userId) {
        this.userService.getById(userId)
            .subscribe(
                data => {
                    this.user = data;
                    this.getAssignUserPermissions();
                });
    }

}
