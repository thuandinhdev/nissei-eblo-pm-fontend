import {Component, EventEmitter, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';

import {UserService} from '../../../../../core/services/user.service';

@Component({
    selector: 'app-assign-user',
    templateUrl: './assign-user.component.html',
    styleUrls: ['./assign-user.component.scss']
})

export class AssignUserComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    assignUserPermissions: any;
    isFormSubmitted = false;
    permissions = [];
    permissionsUsers = [];
    assignPermissions = [];
    hideElements = [];
    isModalLoaded = false;

    constructor(
        public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private userService: UserService
    ) {
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getAssignUserPermissions();
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

    getAssignUserPermissions() {
        this.userService.getUserPermissions()
            .subscribe(
                data => {
                    this.assignUserPermissions = data;
                    this.setAssignUserPermissions();
                    this.isModalLoaded = true;
                });
    }

    setAssignUserPermissions() {
        for (let iRow in this.assignUserPermissions) {
            this.permissions[this.assignUserPermissions[iRow].id] = ['view', 'delete', 'edit'];
            this.permissionsUsers[this.assignUserPermissions[iRow].id] = {
                'name': this.assignUserPermissions[iRow].firstname + ' ' + this.assignUserPermissions[iRow].lastname
            };
        }
    }

    changePermissions(index, key) {
        this.hideElements[index] = !this.hideElements[index];
        if (this.hideElements[index]) {
            this.assignPermissions[key] = ['view'];
        } else {
            delete this.assignPermissions[key];
        }
    }

    checkObjectKeys() {
        return Object.keys(this.assignPermissions).length == 0;
    }

    isPermissionChecked(key, permission, index) {
        if (permission[key]) {
            this.hideElements[index] = true;
            return true;
        } else {
            return false;
        }
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.checkObjectKeys()) {
            return false;
        }

        this.event.emit({permissions: this.assignPermissions});
        this.onCancel();
    }

}
