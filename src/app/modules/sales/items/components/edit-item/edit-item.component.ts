import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ItemService} from '../../../../../core/services/item.service';
import {TaxService} from '../../../../../core/services/tax.service';

@Component({
    selector: 'app-edit-item',
    templateUrl: './edit-item.component.html',
    styleUrls: ['./edit-item.component.scss']
})

export class EditItemComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editItemForm: FormGroup;
    item: any;
    taxes = [];
    isFormSubmitted = false;
    isFormLoaded = false;
    g;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private datepipe: DatePipe,
        private itemService: ItemService,
        private taxService: TaxService
    ) {
    }

    get itemControl() {
        return this.editItemForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getTaxes();
    }

    loadForm() {
        let taxes = [];
        for (let iRow in this.item.taxes) {
            taxes.push(this.item.taxes[iRow].id);
        }

        this.editItemForm = this.formBuilder.group({
            id: [this.item.id],
            name: [this.item.name, Validators.required],
            price: [this.item.price, [Validators.required, Validators.pattern(/^-?(?:(?:0|[1-9][0-9]*)(?:.[0-9]{1,8})?|.[0-9]{1,8})$/)]],
            description: [this.item.description],
            unit: [this.item.unit],
            taxes: [taxes]
        });

        this.isFormLoaded = true;
    }

    getTaxes() {
        this.taxService.getAll().subscribe(
            data => {
                this.taxes = data;
                this.loadForm();
            });

    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editItemForm.invalid) {
            return;
        }

        this.itemService.update(this.editItemForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('items.messages.update'), this.translate.instant('items.title'));
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
