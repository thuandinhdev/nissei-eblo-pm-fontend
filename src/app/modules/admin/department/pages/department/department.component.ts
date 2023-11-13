import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

import {DepartmentService} from '../../../../../core/services/department.service';

import {CreateDepartmentModalComponent} from '../../components/create-department-modal/create-department-modal.component';
import {EditDepartmentModalComponent} from '../../components/edit-department-modal/edit-department-modal.component';

@Component({
    selector: 'app-department',
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss']
})

export class DepartmentComponent implements OnInit {
    public modalRef: BsModalRef;
    departments: any;
    modalConfigs = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered modal-md animated fadeIn'
    };

    constructor(
        public translate: TranslateService,
        private http: HttpClient,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private departmentService: DepartmentService
    ) {
    }

    ngOnInit() {
        this.getDepartments();
    }

    getDepartments() {
        this.departmentService.getAll()
            .subscribe(
                data => {
                    this.departments = data;
                });
    }

    openDepartmentCreateModal() {
        this.modalRef = this.modalService.show(CreateDepartmentModalComponent, this.modalConfigs);
        this.modalRef.content.onClose.subscribe(result => {
            this.getDepartments();
        });
    }

    openDepartmentEditModal(department) {
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                department: department
            }
        };

        this.modalRef = this.modalService.show(EditDepartmentModalComponent, modalConfig);
        this.modalRef.content.onClose.subscribe(result => {
            this.getDepartments();
        });
    }

    deleteDepartment(departmentId) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text1'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {

                // // --
                // this.toastr.error(this.translate.instant('common.not_allowed'));
                // return;

                this.departmentService.delete(departmentId)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('departments.messages.update'), this.translate.instant('departments.title'));
                            this.getDepartments();
                        });
            }
        });
    }

    deleteDepartmentRole(departmentId, roleId) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text') + ' ' + this.translate.instant('departments.title2').toLowerCase(),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                // // --
                // this.toastr.error(this.translate.instant('common.not_allowed'));
                // return;

                this.departmentService.deleteDepartmentRole(departmentId, roleId)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('roles.messages.delete'), this.translate.instant('departments.title'));
                            this.getDepartments();
                        });
            }
        });
    }
}
