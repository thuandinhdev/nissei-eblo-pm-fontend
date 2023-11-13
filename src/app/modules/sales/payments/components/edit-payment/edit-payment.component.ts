import {Component, EventEmitter, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {PaymentService} from '../../../../../core/services/payment.service';
import {PaymentMethodService} from '../../../../../core/services/payment-method.service';

@Component({
    selector: 'app-edit-payment',
    templateUrl: './edit-payment.component.html',
    styleUrls: ['./edit-payment.component.scss'],
    providers: [DatePipe]
})

export class EditPaymentComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    paymentForm: FormGroup;
    loginUser: any;
    payment: any;
    paymentMethods: any;
    isFormSubmitted = false;
    isFormLoaded = false;
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        public datepipe: DatePipe,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private authenticationService: AuthenticationService,
        private paymentMethodService: PaymentMethodService,
        private paymentService: PaymentService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    get paymentControl() {
        return this.paymentForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();

        this.getPaymentMethods();
    }

    getPaymentMethods() {
        this.paymentMethodService.getAll()
            .subscribe(data => {
                this.paymentMethods = data;

                this.loadForm();
            });
    }

    loadForm() {
        this.paymentForm = this.formBuilder.group({
            id: [this.payment.id],
            invoice_id: [this.payment.invoice_id],
            client_id: [this.payment.client_id],
            amount: [this.payment.amount, Validators.required],
            // date: [new Date(this.payment.date), Validators.required],
            payment_method: [this.payment.payment_method, Validators.required],
            transaction_id: [this.payment.transaction_id],
            status: [this.payment.status],
            notes: [this.payment.notes],
        });

        this.isFormLoaded = true;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.paymentForm.invalid) {
            return;
        }

        this.paymentForm.value.date = this.datepipe.transform(this.paymentForm.value.date, 'yyyy-MM-dd');
        this.paymentService.update(this.paymentForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('payments.messages.update'), this.translate.instant('payments.title'));
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
