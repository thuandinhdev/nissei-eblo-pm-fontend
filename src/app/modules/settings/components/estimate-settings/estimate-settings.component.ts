import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {EstimateSettingService} from '../../../../core/services/estimate-setting.service';

import {environment} from '../../../../../environments/environment';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-estimate-settings',
    templateUrl: './estimate-settings.component.html',
    styleUrls: ['./estimate-settings.component.scss']
})
export class EstimateSettingsComponent implements OnInit {

    estimateSettingsForm: FormGroup;
    isFormSubmitted = false;
    isFormLoaded = false;
    isLogoLoaded = true;
    setting: any;
    @ViewChild('logodropzone', {static: false}) logodropzone: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        private formBuilder: FormBuilder,
        private estimateSettingService: EstimateSettingService,
        private toastr: ToastrService,
        public translate: TranslateService
    ) {
    }

    get estimateSetting() {
        return this.estimateSettingsForm.controls;
    }

    ngOnInit() {
        this.getEstimateSetting();
    }

    getEstimateSetting() {
        this.estimateSettingService.getAll().subscribe(data => {
            this.setting = data;
            this.loadForm();
            setTimeout(() => {
                this.loadDropzone();
            });
        });
    }

    loadForm() {
        this.estimateSettingsForm = this.formBuilder.group({
            estimate_prefix: [this.setting.estimate_prefix, [Validators.required, Validators.maxLength(10)]],
            due_after: [this.setting.due_after, [Validators.required]],
            client_note: [this.setting.client_note],
            terms_conditions: [this.setting.terms_conditions],
            auto_remind: [this.setting.auto_remind],
            auto_remind_before: [this.setting.auto_remind_before],
            estimate_logo: [this.setting.estimate_logo]
        });
        this.isFormLoaded = true;
    }

    loadDropzone() {
        let that = this;
        new Dropzone(this.logodropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
            acceptedFiles: 'image/*',
            createImageThumbnails: true,
            init: function () {
                this.on('addedfile', function (file) {
                    const removeButton = Dropzone.createElement('<button class=\'btn btn-sm btn-block\'>' + that.translate.instant('common.remove_file') + '</button>');
                    const _this = this;
                    removeButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.removeFile(file);
                    });

                    file.previewElement.appendChild(removeButton);
                    if (file) {
                        let reader = new FileReader();
                        reader.onload = (e) => {
                            that.estimateSettingsForm.patchValue({estimate_logo: reader.result});
                            this.isLogoLoaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.estimateSettingsForm.patchValue({estimate_logo: null});
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    removeDropzoneImage() {
        this.isLogoLoaded = false;
        this.setting.estimate_logo = null;
        this.estimateSettingsForm.patchValue({estimate_logo: null});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.estimateSettingsForm.invalid) {
            return;
        }

        this.estimateSettingService.create(this.estimateSettingsForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('settings.messages.update'), this.translate.instant('settings.title'));
        });
    }

}
