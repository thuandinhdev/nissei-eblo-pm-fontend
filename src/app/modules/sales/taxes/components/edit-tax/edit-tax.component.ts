import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {Tax} from '../../../../../shared/models/tax.model';

import {TaxService} from '../../../../../core/services/tax.service';

@Component({
    selector: 'app-edit-tax',
    templateUrl: './edit-tax.component.html',
    styleUrls: ['./edit-tax.component.scss']
})

export class EditTaxComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editTaxForm: FormGroup;
    tax: Tax;
    isFormSubmitted = false;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private datepipe: DatePipe,
        private taxService: TaxService
    ) {
    }

    get taxControl() {
        return this.editTaxForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.editTaxForm = this.formBuilder.group({
            id: [this.tax.id],
            tax_name: [this.tax.tax_name, Validators.required],
            tax_rate: [this.tax.tax_rate, [Validators.required, Validators.pattern(/^-?(?:(?:0|[1-9][0-9]*)(?:.[0-9]{1,8})?|.[0-9]{1,8})$/)]]
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editTaxForm.invalid) {
            return;
        }

        this.taxService.update(this.editTaxForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('taxes.messages.update'), this.translate.instant('taxes.title1'));
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
