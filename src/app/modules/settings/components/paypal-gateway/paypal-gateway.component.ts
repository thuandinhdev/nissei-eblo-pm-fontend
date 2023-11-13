import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {SettingService} from '../../../../core/services/setting.service';

@Component({
    selector: 'app-paypal-gateway',
    templateUrl: './paypal-gateway.component.html',
    styleUrls: ['./paypal-gateway.component.scss']
})

export class PaypalGatewayComponent implements OnInit {
    @Input() loginUser: any;
    settingsForm: FormGroup;
    gatewaySettings: any;
    isFormSubmitted = false;
    isFormLoad = false;

    constructor(
        public translate: TranslateService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private settingService: SettingService
    ) {
    }

    get paypalSetting() {
        return this.settingsForm.controls;
    }

    get stripeSetting() {
        return this.settingsForm.controls;
    }

    ngOnInit() {
        this.getPaymentGatewaySettings();
    }

    getPaymentGatewaySettings() {
        this.settingService.getPaymentGatewaySettings()
            .subscribe(
                data => {
                    this.gatewaySettings = data;
                    this.loadForm();
                });
    }

    loadForm() {
        this.settingsForm = this.formBuilder.group({
            form_for: ['paymentgateway_setting'],
            paypal_checkout_label: [this.gatewaySettings.paypal_checkout_label],
            paypal_checkout_client_id: [this.gatewaySettings.paypal_checkout_client_id],
            paypal_checkout_status: [this.gatewaySettings.paypal_checkout_status],
            stripe_label: [this.gatewaySettings.stripe_label],
            stripe_api_key: [this.gatewaySettings.stripe_api_key],
            stripe_secret_key: [this.gatewaySettings.stripe_secret_key],
            stripe_status: [this.gatewaySettings.stripe_status]
        });

        this.isFormLoad = true;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.settingsForm.invalid) {
            return;
        }

        if (this.settingsForm.value.paypal_checkout_label) {
            this.settingsForm.value.paypal_checkout_label = this.settingsForm.value.paypal_checkout_label.toLowerCase();
        }

        this.settingService.createPaymentGatewaySettings(this.settingsForm.value)
            .subscribe(data => {
                this.toastr.success(this.translate.instant('settings.messages.update'), this.translate.instant('settings.title'));
            });
    }

}
