import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {RoleService} from '../../../../../core/services/role.service';
import {Role} from '../../../../../shared/models/role.model';

@Component({
    selector: 'app-edit-role-modal',
    templateUrl: './edit-role-modal.component.html',
    styleUrls: ['./edit-role-modal.component.scss']
})

export class EditRoleModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editRoleForm: FormGroup;
    role: Role;
    isSubmitted = false;

    constructor(
        public translate: TranslateService,
        public bsEditRoleModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private roleService: RoleService,
        private toastr: ToastrService
    ) {
    }

    get roleControl() {
        return this.editRoleForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.editRoleForm = this.formBuilder.group({
            id: [this.role.id],
            name: [this.role.name, [Validators.required, Validators.maxLength(50)]],
            slug: [this.role.slug, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\_]+$/)]],
            description: [this.role.description]
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.editRoleForm.invalid) {
            return;
        }

        this.roleService.update(this.editRoleForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('roles.messages.update'), this.translate.instant('roles.title'));
                    this.event.emit({data: true});
                    this.onCancel();
                }, error => {
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditRoleModalRef.hide();
    }
}
