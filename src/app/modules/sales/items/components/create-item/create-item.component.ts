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
    selector: 'app-create-item',
    templateUrl: './create-item.component.html',
    styleUrls: ['./create-item.component.scss']
})

export class CreateItemComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createItemForm: FormGroup;
    taxes = [];
    isFormSubmitted = false;
    isFormLoaded = false;

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
        return this.createItemForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getTaxes();
    }

    loadForm() {
        this.createItemForm = this.formBuilder.group({
            name: [null, Validators.required],
            price: [null, [Validators.required, Validators.pattern(/^-?(?:(?:0|[1-9][0-9]*)(?:.[0-9]{1,8})?|.[0-9]{1,8})$/)]],
            description: [],
            unit: [],
            taxes: []
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
        if (this.createItemForm.invalid) {
            return;
        }

        this.itemService.create(this.createItemForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('items.messages.create'), this.translate.instant('items.title'));
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
