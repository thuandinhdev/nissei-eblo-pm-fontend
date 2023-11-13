import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {NgxRolesService} from 'ngx-permissions';

import {PaymentService} from '../../../../../core/services/payment.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {InvoiceSettingService} from '../../../../../core/services/invoice-setting.service';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-payment-detail',
    templateUrl: './payment-detail.component.html',
    styleUrls: ['./payment-detail.component.scss']
})

export class PaymentDetailComponent implements OnInit {
    loginUser: any;
    payment: any;
    invoiceSettings: any;
    isPageLoad = false;
    isDownloadable = false;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private paymentService: PaymentService,
        private invoiceSettingService: InvoiceSettingService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        this.route.paramMap.subscribe(params => {
            this.getById(params.get('id'));
        });
    }

    ngOnInit() {
    }

    getCheckPermission() {
        let role = this.ngxRolesService.getRole('admin');

        if (this.loginUser.id == this.payment.client_id) {
            this.isDownloadable = true;
        }

        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            this.isDownloadable = true;
        }

        this.isPageLoad = true;
    }

    getById(paymentId) {
        this.paymentService.getById(paymentId).subscribe(data => {
            this.payment = data;
            this.getInvoiceSettings();
        });
    }

    getInvoiceSettings() {
        this.invoiceSettingService.getAll()
            .subscribe(
                data => {
                    this.invoiceSettings = data;
                    this.getCheckPermission();
                });
    }
}
