import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {EstimateService} from '../../../../../core/services/estimate.service';
import {ItemService} from '../../../../../core/services/item.service';
import {ClientService} from '../../../../../core/services/client.service';
import {TaxService} from '../../../../../core/services/tax.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

@Component({
    selector: 'app-estimate-edit',
    templateUrl: './estimate-edit.component.html',
    styleUrls: ['./estimate-edit.component.scss']
})

export class EstimateEditComponent implements OnInit {
    editEstimateForm: FormGroup;
    selectedItem: number;
    loginUser: any;
    estimate: any;
    clients = [];
    items = [];
    itemsArray = [];
    taxes = [];
    itemTaxes = [];
    taxesNameValues = [];
    total_discount = 0.00;
    estimates = {
        sub_total: 0,
        total_taxes: 0,
        discount: 0.00,
        adjustment: 0.00,
        total: 0
    };
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
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private estimateService: EstimateService,
        private clientService: ClientService,
        private itemService: ItemService,
        private taxService: TaxService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
        this.route.paramMap.subscribe(params => {
            this.getById(params.get('id'));
        });
    }

    get estimateControl() {
        return this.editEstimateForm.controls;
    }

    get itemControl() {
        return this.editEstimateForm.get('item');
    }

    ngOnInit() {
    }

    loadForm() {
        this.editEstimateForm = this.formBuilder.group({
            id: [this.estimate.id],
            estimate_number: [this.estimate.estimate_number],
            client_id: [this.estimate.client_id, Validators.required],
            estimate_date: [new Date(this.estimate.estimate_date), Validators.required],
            valid_till: [new Date(this.estimate.valid_till), Validators.required],
            reference: [this.estimate.reference],
            status: [this.estimate.status, Validators.required],
            discount_type: [this.estimate.discount_type],
            discount: [this.estimate.discount],
            adjustment: [this.estimate.adjustment],
            selectedItem: [null],
            item: this.formBuilder.group({
                item_name: [null],
                item_description: [null],
                quantity: [null],
                unit_price: [null],
                item_unit: [null],
                taxes: [null],
                amount: [0]
            }),
            items: this.estimate.items
        });

        // --
        // Render selected items
        this.setSelectedItems(this.estimate.items);

        this.isFormLoaded = true;
    }

    getById(estimateId) {
        this.estimateService.getById(estimateId).subscribe(data => {
            this.estimate = data;
            this.getClients();
        });
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

                this.loadForm();
            });

    }

    addDays(date: Date, days: number): Date {
        return new Date(date.setDate(date.getDate() + days));
    }

    setSelectedItems(items) {
        for (let iRow in items) {
            let taxes = [];
            for (let jRow in items[iRow].taxes) {
                taxes.push(items[iRow].taxes[jRow].id);
            }

            items[iRow].taxes = taxes;
            this.itemsArray.push(items[iRow]);
        }

        this.estimates.discount = this.estimate.discount;
        this.estimates.adjustment = this.estimate.adjustment;

        this.getItemTaxes();
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
            this.estimates.discount = 0;
        }

        this.getItemTaxes();
    }

    changeDiscountAdjustment(event, type) {
        if (type == 'discount') {
            if (this.editEstimateForm.value.discount_type == 'not_discount') {
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
        let item = this.editEstimateForm.value.item;

        if (item.item_name == null || item.quantity == null || item.unit_price == null) {
            this.toastr.error(this.translate.instant('estimates.create.error_messages.message6'), this.translate.instant('estimates.title'));
            return false;
        }

        this.itemsArray.push(item);
        this.resetChildForm();
        this.estimates.discount = this.editEstimateForm.value.discount;
        this.estimates.adjustment = this.editEstimateForm.value.adjustment;
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
        if (this.editEstimateForm.value.discount_type == 'percent') {
            this.total_discount = ((this.estimates.sub_total + this.estimates.total_taxes) * this.estimates.discount) / 100;
        } else {
            this.total_discount = this.estimates.discount;
        }

        this.estimates.total = (this.estimates.sub_total + this.estimates.total_taxes - this.total_discount) + this.estimates.adjustment;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editEstimateForm.invalid) {
            return;
        }

        if (this.itemsArray.length == 0) {
            this.toastr.error(this.translate.instant('estimates.create.error_messages.message5'), this.translate.instant('estimates.title'));
            return;
        }

        let estimateObj = {
            'id': this.editEstimateForm.value.id,
            'estimate_date': this.datepipe.transform(this.editEstimateForm.value.estimate_date, 'yyyy-MM-dd'),
            'valid_till': this.editEstimateForm.value.valid_till,
            'client_id': this.editEstimateForm.value.client_id,
            'status': this.editEstimateForm.value.status,
            'reference': this.editEstimateForm.value.reference,
            'items': this.itemsArray,
            'adjustment': this.estimates.adjustment,
            'discount_type': this.editEstimateForm.value.discount_type,
            'discount': this.estimates.discount
        };

        this.estimateService.update(estimateObj)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('estimates.messages.update'), this.translate.instant('estimates.title'));
                    this.router.navigate(['estimates']);
                });
    }

}
