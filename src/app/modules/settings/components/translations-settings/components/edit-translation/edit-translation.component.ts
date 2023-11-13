import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {Translation} from '../../../../../../shared/models/translation.model';

import {TranslationService} from '../../../../../../core/services/translation.service';

import {environment} from '../../../../../../../environments/environment';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-edit-translation',
    templateUrl: './edit-translation.component.html',
    styleUrls: ['./edit-translation.component.scss']
})

export class EditTranslationComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editTranslationForm: FormGroup;
    translation: Translation;
    isFormSubmitted = false;
    isFormLoaded = false;
    isProfileUploded = false;
    isProfileLoaded = true;
    @ViewChild('translateDropzone', {static: true}) translateDropzone: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private translationService: TranslationService,
        private toastr: ToastrService,
    ) {
    }

    get getTranslationControl() {
        return this.editTranslationForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.editTranslationForm = this.formBuilder.group({
            id: [this.translation.id],
            status: [this.translation.status],
            icon: [this.translation.icon, Validators.required],
            language: [this.translation.language, Validators.required]
        });
        this.loadDropzone();
        this.isFormLoaded = true;
    }

    loadDropzone() {
        let that = this;
        new Dropzone(this.translateDropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
            acceptedFiles: 'image/*',
            createImageThumbnails: true,
            init: function () {
                this.on('addedfile', function (file) {
                    const removeButton = Dropzone.createElement('<button class=\'btn btn-sm btn-block\'>Remove file</button>');
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
                            that.editTranslationForm.patchValue({icon: reader.result});
                            that.isProfileLoaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.editTranslationForm.patchValue({icon: null});
                    that.isProfileLoaded = false;
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
        this.isProfileUploded = true;
        this.isProfileLoaded = false;
        this.editTranslationForm.patchValue({icon: null});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editTranslationForm.invalid) {
            return;
        }

        // --
        // this.toastr.error(this.translate.instant('common.not_allowed'));
        // this.onCancel();
        // return;

        this.translationService.update(this.editTranslationForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.translations.messages.update'), this.translate.instant('settings.translations.title'));
                    this.event.emit({data: true});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

}


