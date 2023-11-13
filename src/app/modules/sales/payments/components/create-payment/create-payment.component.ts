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
    selector: 'app-create-payment',
    templateUrl: './create-payment.component.html',
    styleUrls: ['./create-payment.component.scss'],
    providers: [DatePipe]
})

export class CreatePaymentComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    paymentForm: FormGroup;
    loginUser: any;
    invoice: any;
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
        private paymentService: PaymentService,
        private paymentMethodService: PaymentMethodService
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
            invoice_id: [this.invoice.id],
            client_id: [this.invoice.client_id],
            amount: [this.invoice.total_due_amount, Validators.required],
            payment_method: [null, Validators.required],
            transaction_id: [null],
            notes: [null],
        });

        this.isFormLoaded = true;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.paymentForm.invalid) {
            return;
        }

        this.paymentForm.value.date = this.datepipe.transform(this.paymentForm.value.date, 'yyyy-MM-dd');
        this.paymentService.create(this.paymentForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('payments.messages.create'), this.translate.instant('payments.title'));
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
