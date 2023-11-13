import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {InvoiceService} from '../../../../../core/services/invoice.service';
import {ItemService} from '../../../../../core/services/item.service';
import {ClientService} from '../../../../../core/services/client.service';
import {TaxService} from '../../../../../core/services/tax.service';
import {ProjectService} from '../../../../../core/services/project.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';
import {InvoiceSettingService} from '../../../../../core/services/invoice-setting.service';

@Component({
    selector: 'app-invoice-create',
    templateUrl: './invoice-create.component.html',
    styleUrls: ['./invoice-create.component.scss'],
    providers: [DatePipe]
})

export class InvoiceCreateComponent implements OnInit {
    createInvoiceForm: FormGroup;
    selectedItem: number;
    loginUser: any;
    invoiceSettings: any;
    projects: any;
    clients = [];
    items = [];
    itemsArray = [];
    taxes = [];
    itemTaxes = [];
    taxesNameValues = [];
    total_discount = 0.00;
    isFormSubmitted = false;
    isFormLoaded = false;
    invoices = {
        sub_total: 0,
        total_taxes: 0,
        discount: 0.00,
        adjustment: 0.00,
        total: 0
    };
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public datepipe: DatePipe,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private invoiceService: InvoiceService,
        private clientService: ClientService,
        private itemService: ItemService,
        private taxService: TaxService,
        private projectService: ProjectService,
        private invoiceSettingService: InvoiceSettingService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    get invoiceControl() {
        return this.createInvoiceForm.controls;
    }

    get itemControl() {
        return this.createInvoiceForm.get('item');
    }

    ngOnInit() {
        this.getInvoiceSettings();
        this.getProjects();
        this.getClients();
        this.getTaxes();
    }

    loadForm() {
        this.createInvoiceForm = this.formBuilder.group({
            project_id: [null],
            client_id: [null, Validators.required],
            invoice_date: [new Date(), Validators.required],
            due_date: [this.addDays(new Date(), this.invoiceSettings.due_after), Validators.required],
            reference: [null],
            status: ['unpaid'],
            discount_type: ['percent'],
            selectedItem: [null],
            discount: [0],
            adjustment: [0],
            item: this.formBuilder.group({
                item_name: [null],
                item_description: [null],
                quantity: [null],
                unit_price: [null],
                item_unit: [null],
                taxes: [null],
                amount: [null]
            }),
            items: []
        });

        this.isFormLoaded = true;
    }

    getProjects() {
        this.projectService.getAll().subscribe(data => {
            this.projects = data;
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
            });
    }

    getClients() {
        this.clientService.getAll()
            .subscribe(
                data => {
                    this.clients = data;
                    this.getInvoiceSettings();
                });
    }

    getInvoiceSettings() {
        this.invoiceSettingService.getAll()
            .subscribe(
                data => {
                    this.invoiceSettings = data;
                    this.getItems();
                });
    }

    getItems() {
        this.itemService.getAll()
            .subscribe(
                data => {
                    this.items = data;
                    this.loadForm();
                });
    }

    addDays(date: Date, days: number): Date {
        return new Date(date.setDate(date.getDate() + days));
    }

    changeItem(event) {
        let taxes = [];
        for (let iRow in event.taxes) {
            taxes.push(event.taxes[iRow].id);
        }

        this.itemControl.patchValue({item_name: event.name});
        this.itemControl.patchValue({item_description: event.description});
        this.itemControl.patchValue({quantity: 1});
        this.itemControl.patchValue({unit_price: event.price});
        this.itemControl.patchValue({item_unit: event.unit});
        this.itemControl.patchValue({taxes: taxes});
    }

    resetChildForm() {
        this.itemControl.patchValue({item_name: null});
        this.itemControl.patchValue({item_description: null});
        this.itemControl.patchValue({quantity: null});
        this.itemControl.patchValue({unit_price: null});
        this.itemControl.patchValue({item_unit: null});
        this.itemControl.patchValue({taxes: []});
    }

    changeDiscountType(event) {
        if (event.id == 'not_discount') {
            this.invoices.discount = 0;
        }

        this.getItemTaxes();
    }

    changeDiscountAdjustment(event, type) {
        if (type == 'discount') {
            if (this.createInvoiceForm.value.discount_type == 'not_discount') {
                this.toastr.error(this.translate.instant('invoices.create.error_messages.message7'), this.translate.instant('invoices.title'));
                return;
            }
            this.invoices.discount = parseFloat(event.target.value);
        } else {
            this.invoices.adjustment = parseFloat(event.target.value);
        }

        if (isNaN(this.invoices.discount)) {
            this.invoices.discount = 0;
        }

        if (isNaN(this.invoices.adjustment)) {
            this.invoices.adjustment = 0;
        }

        this.getItemTaxes();
    }

    projectChange(event: any) {
        if (this.createInvoiceForm.value.project_id == undefined || this.createInvoiceForm.value.project_id == null || this.createInvoiceForm.value.project_id == '') {
            this.createInvoiceForm.patchValue({client_id: null});
            return;
        }

        this.createInvoiceForm.patchValue({client_id: event.client_id});
    }

    addItem(event) {
        event.preventDefault();
        let item = this.createInvoiceForm.value.item;

        if (item.item_name == null || item.quantity == null || item.unit_price == null) {
            this.toastr.error(this.translate.instant('invoices.create.error_messages.message6'), this.translate.instant('invoices.title'));
            return false;
        }

        this.itemsArray.push(item);
        this.resetChildForm();
        this.invoices.discount = this.createInvoiceForm.value.discount;
        this.invoices.adjustment = this.createInvoiceForm.value.adjustment;
        this.getItemTaxes();
    }

    saveItemDetail(index, name, value) {
        this.itemsArray[index][name] = value;
        this.getItemTaxes();
    }

    deleteItem(index) {
        this.itemsArray.splice(index, 1);
        this.getItemTaxes();
    }

    getItemTaxes() {
        this.itemTaxes = [];
        this.invoices.sub_total = 0;
        this.invoices.total_taxes = 0;
        this.invoices.total = 0;
        this.total_discount = 0.00;
        let totalItemAmount = 0;

        // --
        // Count item taxes
        for (let iRow in this.itemsArray) {
            totalItemAmount = this.itemsArray[iRow].quantity * this.itemsArray[iRow].unit_price;

            for (let jRow in this.itemsArray[iRow].taxes) {
                let totalTaxes = 0;
                if (this.itemTaxes[this.itemsArray[iRow].taxes[jRow]] == undefined) {
                    this.itemTaxes[this.itemsArray[iRow].taxes[jRow]] = 0;
                }

                totalTaxes = (totalItemAmount * this.taxesNameValues[this.itemsArray[iRow].taxes[jRow]].tax_rate) / 100;
                this.invoices.total_taxes += totalTaxes;

                this.itemTaxes[this.itemsArray[iRow].taxes[jRow]] = this.itemTaxes[this.itemsArray[iRow].taxes[jRow]] + totalTaxes;
            }

            // --
            // Count sub total
            this.invoices.sub_total += totalItemAmount;
        }

        // --
        // Count total
        if (this.createInvoiceForm.value.discount_type == 'percent') {
            this.total_discount = ((this.invoices.sub_total + this.invoices.total_taxes) * this.invoices.discount) / 100;
        } else {
            this.total_discount = this.invoices.discount;
        }

        this.invoices.total = (this.invoices.sub_total + this.invoices.total_taxes - this.total_discount) + this.invoices.adjustment;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createInvoiceForm.invalid) {
            return;
        }

        if (this.itemsArray.length == 0) {
            this.toastr.error(this.translate.instant('invoices.create.error_messages.message5'), this.translate.instant('invoices.title'));
            return;
        }

        let invoiceObj = {
            'project_id': this.createInvoiceForm.value.project_id,
            'client_id': this.createInvoiceForm.value.client_id,
            'invoice_date': this.datepipe.transform(this.createInvoiceForm.value.invoice_date, 'yyyy-MM-dd'),
            'due_date': this.createInvoiceForm.value.due_date,
            'status': this.createInvoiceForm.value.status,
            'reference': this.createInvoiceForm.value.reference,
            'adjustment': this.createInvoiceForm.value.adjustment,
            'discount_type': this.createInvoiceForm.value.discount_type,
            'discount': this.createInvoiceForm.value.discount,
            'items': this.itemsArray
        };

        this.invoiceService.create(invoiceObj)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('invoices.messages.create'), this.translate.instant('invoices.title'));
                    this.router.navigate(['invoices']);
                });
    }

}
