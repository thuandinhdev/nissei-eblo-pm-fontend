import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';

import {PaymentService} from '../../../../../core/services/payment.service';

@Component({
    selector: 'app-paypal-payment',
    templateUrl: './paypal-payment.component.html',
    styleUrls: ['./paypal-payment.component.scss']
})

export class PaypalPaymentComponent implements OnInit {
    @Output() onPaymentSuccess: EventEmitter<any> = new EventEmitter<any>();
    public payPalConfig?: IPayPalConfig;
    @Input() loginUser: any;
    @Input() invoice: any;
    @Input() gatewaySettings: any;
    unitAmount = '00.00';
    amount = '00.00';

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private paymentService: PaymentService
    ) {
    }

    ngOnInit() {
        this.amount = this.invoice.total_due_amount;
        this.initConfig();
    }

    addPayment(details) {
        let params = {
            invoice_id: this.invoice.id,
            client_id: this.invoice.client_id,
            transaction_id: details.id,
            payment_method: 'PayPal Checkout',
            isPaypal_payment: true,
            amount: details.purchase_units[0].amount.value,
            status: 'successful'
        };

        this.paymentService.create(params)
            .subscribe(data => {
                this.toastr.success(this.translate.instant('payments.messages.create'), this.translate.instant('settings.paypal_settings.title'));
                this.onPaymentSuccess.emit(true);
            });
    }

    cancelPayment() {
        let params = {
            invoice_id: this.invoice.id,
            client_id: this.invoice.client_id,
            payment_method: 'PayPal Checkout',
            amount: this.amount,
            isPaypal_payment: true,
            status: 'failed'
        };

        this.paymentService.create(params)
            .subscribe(data => {
                this.toastr.error(this.translate.instant('payments.messages.failed'), this.translate.instant('settings.paypal_settings.title'));
                this.onPaymentSuccess.emit(true);
            });
    }

    private initConfig(): void {
        this.payPalConfig = {
            currency: this.loginUser.currency.code,
            clientId: this.gatewaySettings.paypal_checkout_client_id,
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: this.loginUser.currency.code,
                            value: this.amount,
                            breakdown: {
                                item_total: {
                                    currency_code: this.loginUser.currency.code,
                                    value: this.amount
                                }
                            }
                        },
                    }
                ]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: this.gatewaySettings.paypal_checkout_label,
                layout: 'vertical',
                shape: 'pill'
            },
            onApprove: (data, actions) => {
                actions.order.get().then(details => {
                });
            },
            onClientAuthorization: (data) => {
                this.addPayment(data);
            },
            onCancel: (data, actions) => {
                this.cancelPayment();
            },
            onError: err => {
                this.cancelPayment();
            },
            onClick: (data, actions) => {
            },
        };
    }

}
