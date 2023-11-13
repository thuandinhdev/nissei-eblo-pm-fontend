import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as';
import {TranslateService} from '@ngx-translate/core';
import {NgxRolesService} from 'ngx-permissions';

import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {InvoiceSettingService} from '../../../../../core/services/invoice-setting.service';
import {InvoiceService} from '../../../../../core/services/invoice.service';
import {HelperService} from '../../../../../core/services/helper.service';
import {TaxService} from '../../../../../core/services/tax.service';
import {SettingService} from '../../../../../core/services/setting.service';
import {PaymentMethodService} from '../../../../../core/services/payment-method.service';

import {CreatePaymentComponent} from '../../../payments/components/create-payment/create-payment.component';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-invoice-view',
    templateUrl: './invoice-view.component.html',
    styleUrls: ['./invoice-view.component.scss']
})

export class InvoiceViewComponent implements OnInit {
    public modalRef: BsModalRef;
    loginUser: any;
    invoice: any;
    taxes: any;
    invoiceSettings: any;
    gatewaySettings: any;
    paymentModes: any;
    itemTaxes = [];
    taxesNameValues = [];
    isPageLoad = false;
    paymentMethod = 'paypal';
    isDownloadable = false;
    invoices = {
        sub_total: 0,
        total_taxes: 0,
        total: 0,
        total_due_amount: 0
    };
    exportAsConfig: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'invoice_table',
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private modalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private exportAsService: ExportAsService,
        private invoiceService: InvoiceService,
        private settingService: SettingService,
        private invoiceSettingService: InvoiceSettingService,
        private taxService: TaxService,
        private helperService: HelperService,
        private authenticationService: AuthenticationService,
        private paymentMethodService: PaymentMethodService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        this.route.paramMap.subscribe(params => {
            this.getById(params.get('id'), true);
        });
    }

    ngOnInit() {
        this.getInvoiceSettings();
        this.getPaymentGatewaySettings();
    }

    getById(invoiceId, isLoad = false) {
        this.invoiceService.getById(invoiceId).subscribe(data => {
            this.invoice = data;

            if (isLoad) {
                this.getPaymentMethods();
                this.getInvoiceAmount();
                this.getCheckPermission();
            }
        });
    }

    getCheckPermission() {
        let role = this.ngxRolesService.getRole('admin');

        if (this.loginUser.id == this.invoice.client_id) {
            this.isDownloadable = true;
        }

        if ((role && role.name == 'admin') || this.loginUser.is_super_admin) {
            this.isDownloadable = true;
        }
    }

    getInvoiceAmount() {
        for (let iRow in this.invoice.payments) {
            this.invoices.total_due_amount += this.invoice.payments[iRow].amount;
        }
    }

    getInvoiceSettings() {
        this.invoiceSettingService.getAll()
            .subscribe(
                data => {
                    this.invoiceSettings = data;
                });
    }

    getPaymentGatewaySettings() {
        this.settingService.getPaymentGatewaySettings()
            .subscribe(
                data => {
                    this.gatewaySettings = data;
                });
    }

    getPaymentMethods() {
        this.paymentMethodService.getAll()
            .subscribe(data => {
                this.paymentModes = data;
                this.getTaxes();
            });
    }

    getTaxes() {
        this.taxService.getAll().subscribe(
            data => {
                this.taxes = data;

                for (let iRow in this.taxes) {
                    if (this.taxesNameValues[this.taxes[iRow].id] == undefined) {
                        this.taxesNameValues[this.taxes[iRow].id] = [];
                    }

                    this.taxesNameValues[this.taxes[iRow].id] = this.taxes[iRow];
                }

                this.getItemTaxes();
            });

    }

    getItemTaxes() {
        this.invoices.sub_total = 0;
        this.invoices.total_taxes = 0;
        this.invoices.total = 0;
        let totalItemAmount = 0;
        let total_discount = 0;

        // --
        // Count item taxes
        for (let iRow in this.invoice.items) {
            totalItemAmount = this.invoice.items[iRow].quantity * this.invoice.items[iRow].unit_price;

            for (let jRow in this.invoice.items[iRow].taxes) {
                let totalTaxes = 0;
                if (this.itemTaxes[this.invoice.items[iRow].taxes[jRow].id] == undefined) {
                    this.itemTaxes[this.invoice.items[iRow].taxes[jRow].id] = 0;
                }

                totalTaxes = (totalItemAmount * this.invoice.items[iRow].taxes[jRow].tax_rate) / 100;
                this.invoices.total_taxes += totalTaxes;

                this.itemTaxes[this.invoice.items[iRow].taxes[jRow].id] = this.itemTaxes[this.invoice.items[iRow].taxes[jRow].id] + totalTaxes;

            }

            // --
            // Count sub total
            this.invoices.sub_total += totalItemAmount;
        }

        // --
        // Count total
        this.invoices.total = (this.invoices.sub_total + this.invoices.total_taxes - this.invoice.total_discount) + this.invoice.adjustment;

        this.isPageLoad = true;
    }

    openPaymentCreateModal() {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered animated fadeIn',
            initialState: {
                invoice: this.invoice
            }
        };

        this.modalRef = this.modalService.show(CreatePaymentComponent, modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getById(this.invoice.id);
        });
    }

    getPaymentSuccess() {
        this.getById(this.invoice.id);
    }

}
