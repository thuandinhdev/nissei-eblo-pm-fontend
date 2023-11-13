import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {TranslationService} from '../../../../../../core/services/translation.service';
import {HelperService} from '../../../../../../core/services/helper.service';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-create-translation',
    templateUrl: './create-translation.component.html',
    styleUrls: ['./create-translation.component.scss']
})

export class CreateTranslationComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createTranslationForm: FormGroup;
    languages: any;
    isFormSubmitted = false;
    isFormLoaded = false;

    @ViewChild('translateDropzone', {static: true}) translateDropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private translationService: TranslationService,
        private helperService: HelperService,
        private toastr: ToastrService,
    ) {
    }

    get getTranslationControl() {
        return this.createTranslationForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getLanguages();
        this.loadForm();
    }

    getLanguages() {
        this.helperService.getLanguages()
            .subscribe(
                data => {
                    this.languages = data;
                });
    }

    loadForm() {
        this.createTranslationForm = this.formBuilder.group({
            icon: [null, Validators.required],
            language: [null, Validators.required]
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
                            that.createTranslationForm.patchValue({icon: reader.result});
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.createTranslationForm.patchValue({icon: ''});
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createTranslationForm.invalid) {
            return;
        }

        this.translationService.create(this.createTranslationForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('settings.translations.messages.create'), this.translate.instant('settings.translations.title'));
                    this.event.emit({data: true});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

}

