import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {CustomField} from './../../../../shared/models/custom-field.model';

import {CustomFieldsService} from '../../../../core/services/custom-fields.service';
import {HelperService} from '../../../../core/services/helper.service';

@Component({
    selector: 'app-custom-field-edit',
    templateUrl: './custom-field-edit.component.html',
    styleUrls: ['./custom-field-edit.component.scss']
})

export class CustomFieldEditComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editCustomFieldForm: FormGroup;
    formTables: any;
    selectboxOptions: any;
    customField: CustomField;
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
        return this.editCustomFieldForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();
        this.getAllFormFields();
    }

    loadForms() {
        this.editCustomFieldForm = this.formBuilder.group({
            id: [this.customField.id],
            form_id: [this.customField.form_id, Validators.required],
            field_label: [this.customField.field_label, Validators.required],
            help_text: [this.customField.help_text],
            is_required: [this.customField.is_required],
            // show_on_details: [this.customField.show_on_details],
            field_type: [this.customField.field_type],
            default_value: [null],
            select_options: this.formBuilder.array([]),
            status: [this.customField.status, Validators.required],
        });

        this.isPageLoaded = true;
        this.editCustomFieldForm.controls.form_id.disable();
        this.editCustomFieldForm.controls.field_type.disable();
        if (this.editCustomFieldForm.get('field_type').value == 'dropdown' && this.customField.default_value != []) {
            this.addDynamicOptions(this.customField.default_value);
        }
    }

    addDynamicOptions(options) {
        let that = this;
        options = JSON.parse(options);
        options.forEach(function (element) {
            let control = <FormArray>that.editCustomFieldForm.controls.select_options;
            control.push(
                that.formBuilder.group({
                    value: [element.value, Validators.required],
                    label: [element.label, Validators.required],
                })
            );
        });
    }

    addOption() {
        let control = <FormArray>this.editCustomFieldForm.controls.select_options;
        control.push(
            this.formBuilder.group({
                value: [null, Validators.required],
                label: [null, Validators.required],
            })
        );
    }

    deleteOption(index) {
        let control = <FormArray>this.editCustomFieldForm.controls.select_options;
        control.removeAt(index);
    }

    onChange(event) {
        if (event.value == 'dropdown') {
            this.addOption();
            return;
        }

        const arr = <FormArray>this.editCustomFieldForm.controls.select_options;
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

        if (this.editCustomFieldForm.invalid) {
            return;
        }
        this.editCustomFieldForm.controls.form_id.enable();
        this.editCustomFieldForm.controls.field_type.enable();

        if (this.editCustomFieldForm.value.field_type == 'dropdown') {
            this.editCustomFieldForm.patchValue({default_value: this.editCustomFieldForm.value.select_options});
        }

        if (this.editCustomFieldForm.value.field_type == 'checkbox') {
            this.editCustomFieldForm.patchValue({is_required: false});
        }

        this.customFieldsService.update(this.editCustomFieldForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.custom_fields.messages.update'), this.translate.instant('settings.custom_fields.title'));
                    this.event.emit({data: true});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
