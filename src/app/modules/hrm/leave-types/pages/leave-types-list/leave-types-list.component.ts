import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {NgxRolesService} from 'ngx-permissions';
import Swal from 'sweetalert2';

import {LeavetypeService} from '../../../../../core/services/leavetype.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

@Component({
    selector: 'app-leave-types-list',
    templateUrl: './leave-types-list.component.html',
    styleUrls: ['./leave-types-list.component.scss']
})

export class LeaveTypesListComponent implements OnInit {
    createLeaveTypeForm: FormGroup;
    leaveTypes = [];
    isSubmitted = false;

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private http: HttpClient,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private leavetypeService: LeavetypeService
    ) {
    }

    get leavetypeControl() {
        return this.createLeaveTypeForm.controls;
    }

    ngOnInit() {
        this.getLeaveTypes();
        this.loadForms();
    }

    loadForms() {
        this.createLeaveTypeForm = this.formBuilder.group({
            leave_type: [null, [Validators.required, Validators.maxLength(20)]],
            no_of_leaves: [null, [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
            color: ['#1ab394', [Validators.required]]
        });
    }

    getLeaveTypes() {
        this.leavetypeService.getAll()
            .subscribe(
                data => {
                    this.leaveTypes = data;
                });
    }

    saveLeaveTypeDetail(index, name, value) {
        this.leaveTypes[index][name] = value;
        this.leavetypeService.update(this.leaveTypes[index])
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('leave_types.messages.update'), this.translate.instant('leave_types.title'));
                    this.getLeaveTypes();
                });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.createLeaveTypeForm.invalid) {
            return;
        }

        this.leavetypeService.create(this.createLeaveTypeForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('leave_types.messages.create'), this.translate.instant('leave_types.title'));
            this.getLeaveTypes();
            this.isSubmitted = false;
            this.createLeaveTypeForm.reset();
        });
    }

    deleteLeaveType(id) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + this.translate.instant('leave_types.title1'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.leavetypeService.delete(id)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('leave_types.messages.delete'), this.translate.instant('leave_types.title'));
                            this.getLeaveTypes();
                        });
            }
        });
    }

}
