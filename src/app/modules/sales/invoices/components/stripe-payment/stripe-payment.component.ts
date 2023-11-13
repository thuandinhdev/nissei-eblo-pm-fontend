import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';

import {PaymentService} from '../../../../../core/services/payment.service';

@Component({
    selector: 'app-stripe-payment',
    templateUrl: './stripe-payment.component.html',
    styleUrls: ['./stripe-payment.component.scss']
})

export class StripePaymentComponent implements OnInit {
    @Output() onPaymentSuccess: EventEmitter<any> = new EventEmitter<any>();
    @Input() loginUser: any;
    @Input() invoice: any;
    @Input() gatewaySettings: any;
    handler: any = null;
    amount = '00.00';


    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private paymentService: PaymentService
    ) {
    }

    ngOnInit() {
        this.amount = this.invoice.total_due_amount;
        this.loadStripe();
    }

    pay(amount) {
        let that = this;
        var handler = (<any>window).StripeCheckout.configure({
            key: this.gatewaySettings.stripe_api_key,
            locale: 'auto',
            currency: this.loginUser.currency.code,
            token: function (token: any) {
                that.stripePaymentCharge(token);
            }
        });

        handler.open({
            name: this.gatewaySettings.stripe_label,
            description: this.translate.instant('payments.view.payment_receipt') + ' ' + this.invoice.invoice_number,
            amount: amount * 100
        });
    }

    loadStripe() {
        let style = {
            base: {
                iconColor: '#c4f0ff',
                color: '#fff',
                fontWeight: 500,
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                ':-webkit-autofill': {
                    color: '#fce883',
                },
                '::placeholder': {
                    color: '#87BBFD',
                },
            },
            invalid: {
                iconColor: '#FFC7EE',
                color: '#FFC7EE',
            }
        };

        if (!window.document.getElementById('stripe-script')) {
            var s = window.document.createElement('script');
            s.id = 'stripe-script';
            s.type = 'text/javascript';
            s.src = 'https://checkout.stripe.com/checkout.js';
            s.onload = () => {
                this.handler = (<any>window).StripeCheckout.configure({
                    key: this.gatewaySettings.stripe_api_key,
                    currency: this.loginUser.currency.code,
                    locale: 'auto',
                    style: style,
                    token: function (token: any) {
                    }
                });
            };
            window.document.body.appendChild(s);
        }
    }

    stripePaymentCharge(token) {
        let params = {
            invoice_id: this.invoice.id,
            client_id: this.invoice.client_id,
            amount: this.amount,
            currency: this.loginUser.currency.code,
            description: token.id,
            email: token.email,
            payment_method: 'Stripe Checkout'
        };

        this.paymentService.stripePaymentCharge(params)
            .subscribe(data => {
                this.toastr.success(this.translate.instant('payments.messages.create'), this.translate.instant('settings.stripe_settings.title'));
                this.onPaymentSuccess.emit(true);
            }, error => {
                let msg = error.error;

                if (msg && msg.message) {
                    msg = msg.message;
                }

                if (msg.error && msg.error.message) {
                    msg = msg.error.message;
                }

                this.toastr.error(msg, this.translate.instant('settings.stripe_settings.title'));
            });
    }
}
