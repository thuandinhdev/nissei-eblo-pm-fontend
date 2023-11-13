import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ProviderService} from '../../../../../core/services/provider.service';

@Component({
    selector: 'app-create-provider',
    templateUrl: './create-provider.component.html',
    styleUrls: ['./create-provider.component.scss']
})

export class CreateProviderComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createProviderForm: FormGroup;
    isSubmitted = false;

    constructor(
        public translate: TranslateService,
        public bsCreateProviderModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private providerService: ProviderService
    ) {
    }

    get providerControl() {
        return this.createProviderForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.createProviderForm = this.formBuilder.group({
            firstname: [null, [Validators.required, Validators.maxLength(50)]],
            lastname: [null, [Validators.required, Validators.maxLength(50)]],
            email: [null, [Validators.required, Validators.email]],
            color: [null, Validators.required],
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.createProviderForm.invalid) {
            return;
        }

        this.providerService.create(this.createProviderForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('providers.messages.create'), this.translate.instant('providers.title'));
                    this.event.emit({data: true});
                    this.onCancel();
                }, error => {
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateProviderModalRef.hide();
    }

}
