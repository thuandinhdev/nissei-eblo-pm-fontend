import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {NgxRolesService} from 'ngx-permissions';
import Swal from 'sweetalert2';

import {LeaveService} from '../../../../../core/services/leave.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

import {half_leaves_duration} from '../../../../../core/helpers/hrm.helper';
import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss']
})

export class ListViewComponent implements OnInit {
    loginUser: any;
    leaves: any;
    halfLeavesDuration = half_leaves_duration;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private http: HttpClient,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private leaveService: LeaveService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.getPendingLeaves();
    }

    getPendingLeaves() {
        this.leaveService.getPendingLeaves().subscribe(
            data => {
                this.leaves = data;
            });
    }

    changeLeaveStatus(leaveId: any, statusId) {
        let changeLeave = {
            id: leaveId,
            status: statusId
        };

        this.leaveService.changeStatus(changeLeave)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('leaves.messages.approve'), this.translate.instant('leaves.title'));
                    this.getPendingLeaves();
                });
    }

    changeRejectLeaveStatus(leaveId: any, statusId) {
        Swal.fire({
            input: 'textarea',
            inputPlaceholder: this.translate.instant('leaves.create.fields.reject_reason') + ' ...',
            inputAttributes: {
                'aria-label': this.translate.instant('leaves.create.fields.reject_reason')
            },
            showCancelButton: true
        }).then((result) => {
            if (result.value || result.value == '') {
                let changeLeave = {
                    id: leaveId,
                    status: statusId,
                    reject_reason: result.value
                };

                this.leaveService.changeRejectLeaveStatus(changeLeave)
                    .subscribe(data => {
                        this.toastr.success(this.translate.instant('leaves.messages.reject'), this.translate.instant('leaves.title'));
                        this.getPendingLeaves();
                    });
            }
        });
    }

    getTranslateDurationType(durationType) {
        return this.halfLeavesDuration[durationType];
    }

}
