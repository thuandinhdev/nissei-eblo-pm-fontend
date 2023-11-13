import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {TaxService} from '../../../../../core/services/tax.service';

@Component({
    selector: 'app-create-tax',
    templateUrl: './create-tax.component.html',
    styleUrls: ['./create-tax.component.scss']
})

export class CreateTaxComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createTaxForm: FormGroup;
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
        return this.createTaxForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.createTaxForm = this.formBuilder.group({
            tax_name: [null, Validators.required],
            tax_rate: [null, [Validators.required, Validators.pattern(/^-?(?:(?:0|[1-9][0-9]*)(?:.[0-9]{1,8})?|.[0-9]{1,8})$/)]]
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createTaxForm.invalid) {
            return;
        }

        this.taxService.create(this.createTaxForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('taxes.messages.create'), this.translate.instant('taxes.title1'));
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
