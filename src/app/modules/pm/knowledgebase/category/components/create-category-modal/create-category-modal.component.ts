import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {KnowledgeBaseService} from './../../../../../../core/services/knowledge-base.service';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-create-category-modal',
    templateUrl: './create-category-modal.component.html',
    styleUrls: ['./create-category-modal.component.scss']
})

export class CreateCategoryModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    categoryCreateForm: FormGroup;
    isFormSubmitted = false;
    isPageLoaded = false;

    @ViewChild('pdfdropzone', {static: false}) pdfdropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        private formBuilder: FormBuilder,
        private bsCreateCategoryModalRef: BsModalRef,
        private toastr: ToastrService,
        private knowledgeBaseService: KnowledgeBaseService
    ) {
    }

    get categoryControl() {
        return this.categoryCreateForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();
    }

    loadForms() {
        this.categoryCreateForm = this.formBuilder.group({
            category_name: ['', [Validators.required, Validators.maxLength(50)]],
            file: ['', Validators.required],
            file_extension: ['']
        });
        this.isPageLoaded = true;

        setTimeout(() => {
            this.loadDropzone();
        });
    }

    loadDropzone() {
        let that = this;
        new Dropzone(this.pdfdropzone.nativeElement, {
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
                        let reader = new FileReader(),
                            fileName = file.name;

                        if (fileName) {
                            fileName = fileName.split('.').pop();
                        }

                        reader.onload = (e) => {
                            that.categoryCreateForm.patchValue({file: reader.result});
                            that.categoryCreateForm.patchValue({file_extension: fileName});
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.categoryCreateForm.patchValue({file: null});
                    that.categoryCreateForm.patchValue({file_extension: null});
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
        if (this.categoryCreateForm.invalid) {
            return;
        }

        this.knowledgeBaseService.create(this.categoryCreateForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('knowledge_base.category.messages.create'), this.translate.instant('knowledge_base.title'));
                    this.event.emit({data});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateCategoryModalRef.hide();
    }

}

