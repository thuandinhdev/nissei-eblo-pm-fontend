import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {Department} from '../../../../../shared/models/department.model';

import {RoleService} from '../../../../../core/services/role.service';
import {DepartmentService} from '../../../../../core/services/department.service';

@Component({
    selector: 'app-edit-department-modal',
    templateUrl: './edit-department-modal.component.html',
    styleUrls: ['./edit-department-modal.component.scss']
})

export class EditDepartmentModalComponent implements OnInit {
    public onClose: Subject<boolean>;
    editDepartmentForm: FormGroup;
    department: Department;
    roles: {};
    isSubmitted = false;
    department_roles = [];

    constructor(
        public translate: TranslateService,
        public bsEditModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private roleService: RoleService,
        private departmentService: DepartmentService
    ) {
    }

    get departmentControl() {
        return this.editDepartmentForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getRoles();
        this.loadForm();
    }

    loadForm() {
        this.editDepartmentForm = this.formBuilder.group({
            department_name: [this.department.name, Validators.required]
        });

        if (this.department && this.department.roles.length > 0) {
            for (let iRow in this.department.roles) {
                this.department_roles.push(this.department.roles[iRow].id);
            }
        }
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
        if (this.editDepartmentForm.invalid || this.department_roles.length == 0) {
            return;
        }

        // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // this.onCancel();
        // return;

        let roleObj = {
            id: this.department.id,
            name: this.editDepartmentForm.value.department_name,
            department_roles: this.department_roles
        };

        this.departmentService.update(roleObj)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('departments.messages.update'), this.translate.instant('departments.title'));
                    this.onCancel();
                }, error => {
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditModalRef.hide();
    }

}
