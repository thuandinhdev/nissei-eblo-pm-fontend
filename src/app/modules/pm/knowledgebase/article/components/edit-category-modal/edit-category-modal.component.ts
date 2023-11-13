import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {KnowledgeBaseService} from './../../../../../../core/services/knowledge-base.service';

import {environment} from '../../../../../../../environments/environment';
import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-edit-category-modal',
    templateUrl: './edit-category-modal.component.html',
    styleUrls: ['./edit-category-modal.component.scss']
})

export class EditCategoryModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    categoryEditForm: FormGroup;
    category: any;
    logoDropzone: any;
    isFormSubmitted = false;
    isPageLoaded = false;
    isCompanyLogoUploaded = false;
    @ViewChild('logodropzone', {static: false}) logodropzone: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private formBuilder: FormBuilder,
        private bsCreateCategoryModalRef: BsModalRef,
        private toastr: ToastrService,
        private knowledgeBaseService: KnowledgeBaseService
    ) {
    }

    get categoryControl() {
        return this.categoryEditForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();
    }

    loadForms() {
        this.categoryEditForm = this.formBuilder.group({
            id: [this.category.id],
            category_name: [this.category.category_name, [Validators.required, Validators.maxLength(50)]],
            file: [this.category.category_logo, Validators.required],
            file_extension: ['']
        });

        if (this.category.category_logo) {
            this.categoryEditForm.patchValue({file_extension: this.category.category_logo.split('.').pop()});
            this.isCompanyLogoUploaded = true;
        }

        setTimeout(() => {
            this.loadDropzone();
        });
        this.isPageLoaded = true;
    }

    loadDropzone() {
        let that = this;
        this.logoDropzone = new Dropzone(this.logodropzone.nativeElement, {
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
                            that.categoryEditForm.patchValue({file: reader.result});
                            that.categoryEditForm.patchValue({file_extension: file.name.split('.').pop()});
                            this.isCompanyLogoUploaded = false;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.categoryEditForm.patchValue({file: null});
                    that.categoryEditForm.patchValue({file_extension: null});
                    this.isCompanyLogoUploaded = false;
                });

                this.on('error', function (file, message: any) {
                    if (file) {
                        that.toastr.error(message);
                    }
                });
            }
        });
    }

    removeDropzoneFiles() {
        this.categoryEditForm.patchValue({file: null});
        this.categoryEditForm.patchValue({file_extension: null});
        this.logoDropzone.removeAllFiles(true);
        this.isCompanyLogoUploaded = false;
        $('#dropZoneFile').html('');
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.categoryEditForm.invalid) {
            return;
        }

        if (this.isCompanyLogoUploaded) {
            if (this.category.category_logo) {
                this.categoryEditForm.patchValue({file: this.isCompanyLogoUploaded});
                this.categoryEditForm.patchValue({file_extension: this.category.category_logo.split('.').pop()});
            }
        }

        this.knowledgeBaseService.updateCategory(this.categoryEditForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('knowledge_base.category.messages.update'), this.translate.instant('knowledge_base.title'));
                    this.event.emit({data});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateCategoryModalRef.hide();
    }
}
