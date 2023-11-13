import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {EstimateSettingService} from '../../../../../core/services/estimate-setting.service';
import {EstimateService} from '../../../../../core/services/estimate.service';
import {ItemService} from '../../../../../core/services/item.service';
import {ClientService} from '../../../../../core/services/client.service';
import {TaxService} from '../../../../../core/services/tax.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

@Component({
    selector: 'app-estimate-create',
    templateUrl: './estimate-create.component.html',
    styleUrls: ['./estimate-create.component.scss'],
    providers: [DatePipe]
})

export class EstimateCreateComponent implements OnInit {
    createEstimateForm: FormGroup;
    selectedItem: number;
    loginUser: any;
    estimateSettings: any;
    clients = [];
    items = [];
    itemsArray = [];
    taxes = [];
    itemTaxes = [];
    taxesNameValues = [];
    estimates = {
        sub_total: 0,
        total_taxes: 0,
        discount: 0.00,
        adjustment: 0.00,
        total: 0
    };
    total_discount = 0.00;
    isFormSubmitted = false;
    isFormLoaded = false;
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
        private estimateService: EstimateService,
        private clientService: ClientService,
        private itemService: ItemService,
        private taxService: TaxService,
        private estimateSettingService: EstimateSettingService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    get estimateControl() {
        return this.createEstimateForm.controls;
    }

    get itemControl() {
        return this.createEstimateForm.get('item');
    }

    ngOnInit() {
        this.getEstimateSettings();
        this.getClients();
        this.getTaxes();
    }

    loadForm() {
        this.createEstimateForm = this.formBuilder.group({
            client_id: [null, Validators.required],
            estimate_date: [new Date(), Validators.required],
            valid_till: [this.addDays(new Date(), this.estimateSettings.due_after), Validators.required],
            reference: [null],
            discount_type: ['percent'],
            discount: [0],
            adjustment: [0],
            status: ['sent', Validators.required],
            selectedItem: [null],
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

    getClients() {
        this.clientService.getAll()
            .subscribe(
                data => {
                    this.clients = data;

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

    getEstimateSettings() {
        this.estimateSettingService.getAll()
            .subscribe(
                data => {
                    this.estimateSettings = data;
                });
    }

    addDays(date: Date, days: number): Date {
        return new Date(date.setDate(date.getDate() + days));
    }

    changeItem(event) {
        if (event) {
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
            this.estimates.discount = 0;
        }

        this.getItemTaxes();
    }

    changeDiscountAdjustment(event, type) {
        if (type == 'discount') {
            if (this.createEstimateForm.value.discount_type == 'not_discount') {
                this.toastr.error(this.translate.instant('estimates.create.error_messages.message7'), this.translate.instant('estimates.title'));
                return;
            }
            this.estimates.discount = parseFloat(event.target.value);
        } else {
            this.estimates.adjustment = parseFloat(event.target.value);
        }

        if (isNaN(this.estimates.discount)) {
            this.estimates.discount = 0;
        }

        if (isNaN(this.estimates.adjustment)) {
            this.estimates.adjustment = 0;
        }

        this.getItemTaxes();
    }

    addItem(event) {
        event.preventDefault();
        let item = this.createEstimateForm.value.item;

        if (item.item_name == null || item.quantity == null || item.unit_price == null) {
            this.toastr.error(this.translate.instant('estimates.create.error_messages.message6'), this.translate.instant('estimates.title'));
            return false;
        }

        this.itemsArray.push(item);
        this.resetChildForm();
        this.estimates.discount = this.createEstimateForm.value.discount;
        this.estimates.adjustment = this.createEstimateForm.value.adjustment;
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
        this.estimates.sub_total = 0;
        this.estimates.total_taxes = 0;
        this.estimates.total = 0;
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
                this.estimates.total_taxes += totalTaxes;

                this.itemTaxes[this.itemsArray[iRow].taxes[jRow]] = this.itemTaxes[this.itemsArray[iRow].taxes[jRow]] + totalTaxes;

            }

            // --
            // Count sub total
            this.estimates.sub_total += totalItemAmount;
        }

        // --
        // Count total
        if (this.createEstimateForm.value.discount_type == 'percent') {
            this.total_discount = ((this.estimates.sub_total + this.estimates.total_taxes) * this.estimates.discount) / 100;
        } else {
            this.total_discount = this.estimates.discount;
        }

        this.estimates.total = (this.estimates.sub_total + this.estimates.total_taxes - this.total_discount) + this.estimates.adjustment;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createEstimateForm.invalid) {
            return;
        }

        if (this.itemsArray.length == 0) {
            this.toastr.error(this.translate.instant('estimates.create.error_messages.message5'), this.translate.instant('estimates.title'));
            return;
        }

        let estimateObj = {
            'client_id': this.createEstimateForm.value.client_id,
            'estimate_date': this.datepipe.transform(this.createEstimateForm.value.estimate_date, 'yyyy-MM-dd'),
            'valid_till': this.createEstimateForm.value.valid_till,
            'status': this.createEstimateForm.value.status,
            'reference': this.createEstimateForm.value.reference,
            'adjustment': this.estimates.adjustment,
            'discount_type': this.createEstimateForm.value.discount_type,
            'discount': this.estimates.discount,
            'items': this.itemsArray
        };

        this.estimateService.create(estimateObj)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('estimates.messages.create'), this.translate.instant('estimates.title'));
                    this.router.navigate(['estimates']);
                });
    }

}
