import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {CustomFieldsService} from '../../../../core/services/custom-fields.service';
import {HelperService} from '../../../../core/services/helper.service';

@Component({
    selector: 'app-custom-field-create',
    templateUrl: './custom-field-create.component.html',
    styleUrls: ['./custom-field-create.component.scss']
})

export class CustomFieldCreateComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    formTables: any;
    selectboxOptions: any;
    createCustomFieldForm: FormGroup;
    isFormSubmitted = false;
    isPageLoaded = false;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private customFieldsService: CustomFieldsService,
        private helperService: HelperService
    ) {
    }

    get customFieldControl() {
        return this.createCustomFieldForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();

        this.loadForms();
        this.getAllFormFields();
    }

    loadForms() {
        this.createCustomFieldForm = this.formBuilder.group({
            form_id: [null, Validators.required],
            field_label: [null, Validators.required],
            help_text: [null],
            is_required: [false],
            // show_on_details: [true],
            field_type: [null, Validators.required],
            default_value: [null],
            select_options: this.formBuilder.array([]),
            status: [true, Validators.required],
        });
    }

    addOption() {
        let control = <FormArray>this.createCustomFieldForm.controls.select_options;
        control.push(
            this.formBuilder.group({
                value: [null, Validators.required],
                label: [null, Validators.required],
            })
        );
    }

    deleteOption(index) {
        let control = <FormArray>this.createCustomFieldForm.controls.select_options;
        control.removeAt(index);
    }

    onChange(event) {
        if (event.value == 'dropdown') {
            this.addOption();
            return;
        }

        const arr = <FormArray>this.createCustomFieldForm.controls.select_options;
        arr.controls = [];
        arr.removeAt(0);
        arr.reset();
    }

    getAllFormFields() {
        this.customFieldsService.getFormTables()
            .subscribe(
                data => {
                    this.formTables = data;
                });
    }

    onSubmit() {
        this.isFormSubmitted = true;

        if (this.createCustomFieldForm.invalid) {
            return;
        }

        if (this.createCustomFieldForm.value.field_type == 'dropdown') {
            this.createCustomFieldForm.patchValue({default_value: this.createCustomFieldForm.value.select_options});
        }

        if (this.createCustomFieldForm.value.field_type == 'checkbox') {
            this.createCustomFieldForm.patchValue({is_required: false});
        }

        this.customFieldsService.create(this.createCustomFieldForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.custom_fields.messages.create'), this.translate.instant('settings.custom_fields.title'));
                    this.event.emit({data: true});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
