import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {PaymentMethodService} from '../../../../../core/services/payment-method.service';

@Component({
    selector: 'app-create-payment-method',
    templateUrl: './create-payment-method.component.html',
    styleUrls: ['./create-payment-method.component.scss']
})

export class CreatePaymentMethodComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    paymentMethodForm: FormGroup;
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
            method_name: [null, Validators.required],
            description: [null],
            show_on_pdf: [false, Validators.required]
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.paymentMethodForm.invalid) {
            return;
        }

        this.paymentMethodService.create(this.paymentMethodForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('payment_methods.messages.create'), this.translate.instant('payment_methods.title'));
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
