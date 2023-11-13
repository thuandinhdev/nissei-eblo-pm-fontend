import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {SettingService} from '../../../../core/services/setting.service';

@Component({
    selector: 'app-company-detail',
    templateUrl: './company-detail.component.html',
    styleUrls: ['./company-detail.component.scss']
})

export class CompanyDetailComponent implements OnInit {
    @Input() settings: any;
    @Input() countries: any;
    settingsForm: FormGroup;
    isFormSubmitted = false;

    constructor(
        public translate: TranslateService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private settingService: SettingService,
    ) {
    }

    get companyDetail() {
        return this.settingsForm.controls;
    }

    ngOnInit() {
        this.loadForm();
    }

    loadForm() {
        this.settingsForm = this.formBuilder.group({
            form_for: ['company_detail'],
            company_name: [this.settings.company_name, [Validators.required, Validators.maxLength(50)]],
            company_legal_name: [this.settings.company_legal_name, [Validators.maxLength(50)]],
            company_short_name: [this.settings.company_short_name, [Validators.required, Validators.maxLength(10)]],
            company_address: [this.settings.company_address, Validators.required],
            company_country: [this.settings.company_country],
            company_city: [this.settings.company_city],
            company_zipcode: [this.settings.company_zipcode, [Validators.pattern(/^[0-9]{1,10}$/)]],
            company_email: [this.settings.company_email, [Validators.required, Validators.email]],
            company_website: [this.settings.company_website, Validators.pattern(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/)],
            company_phone: [this.settings.company_phone, Validators.pattern(/^(?:[+])?(\d[ -]?){1,15}$/)],
            contact_person: [this.settings.contact_person],
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.settingsForm.invalid) {
            return;
        }

        this.settingService.create(this.settingsForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.messages.update'), this.translate.instant('settings.title'));
                });
    }

}
