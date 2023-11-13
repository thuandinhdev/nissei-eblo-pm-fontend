import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {RoleService} from '../../../../../core/services/role.service';
import {DepartmentService} from '../../../../../core/services/department.service';

@Component({
    selector: 'app-create-department-modal',
    templateUrl: './create-department-modal.component.html',
    styleUrls: ['./create-department-modal.component.scss']
})

export class CreateDepartmentModalComponent implements OnInit {
    public onClose: Subject<boolean>;
    createDepartmentForm: FormGroup;
    roles: {};
    isSubmitted = false;
    department_roles = [];

    constructor(
        public translate: TranslateService,
        public bsCreateModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private roleService: RoleService,
        private departmentService: DepartmentService
    ) {
    }

    get departmentControl() {
        return this.createDepartmentForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
        this.getRoles();
    }

    loadForm() {
        this.createDepartmentForm = this.formBuilder.group({
            department_name: ['', Validators.required]
        });
    }

    getRoles() {
        this.roleService.getAll()
            .subscribe(
                data => {
                    this.roles = data;
                });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.createDepartmentForm.invalid || this.department_roles.length == 0) {
            return;
        }

        let roleObj = {
            name: this.createDepartmentForm.value.department_name,
            department_roles: this.department_roles
        };

        this.departmentService.create(roleObj)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('departments.messages.create'), this.translate.instant('departments.title'));
                    this.onCancel();
                }, error => {
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateModalRef.hide();
    }

}
