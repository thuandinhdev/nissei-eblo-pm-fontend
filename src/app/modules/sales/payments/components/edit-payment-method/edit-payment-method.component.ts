import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {PaymentMethodService} from '../../../../../core/services/payment-method.service';

@Component({
    selector: 'app-edit-payment-method',
    templateUrl: './edit-payment-method.component.html',
    styleUrls: ['./edit-payment-method.component.scss']
})

export class EditPaymentMethodComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    paymentMethodForm: FormGroup;
    method: any;
    isFormSubmitted = false;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private paymentMethodService: PaymentMethodService
    ) {
    }

    get paymentMethodControl() {
        return this.paymentMethodForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.paymentMethodForm = this.formBuilder.group({
            id: [this.method.id],
            method_name: [this.method.method_name, Validators.required],
            description: [this.method.description],
            show_on_pdf: [this.method.show_on_pdf, Validators.required]
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.paymentMethodForm.invalid) {
            return;
        }

        this.paymentMethodService.update(this.paymentMethodForm.value)
            .subscribe(data => {
                this.toastr.success(this.translate.instant('payment_methods.messages.update'), this.translate.instant('payment_methods.title'));
                this.event.emit({data: true});
                this.onCancel();
            }, error => {
                this.onCancel();
            });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

}
