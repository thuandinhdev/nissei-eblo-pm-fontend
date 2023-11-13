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
    selector: 'app-edit-article-modal',
    templateUrl: './edit-article-modal.component.html',
    styleUrls: ['./edit-article-modal.component.scss']
})

export class EditArticleModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    articleEditForm: FormGroup;
    article: any;
    logoDropzone: any;
    isFormSubmitted = false;
    isPageLoaded = false;
    categories = [];
    @ViewChild('logodropzone', {static: false}) logodropzone: ElementRef;
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private bsEditArticalModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private knowledgeBaseService: KnowledgeBaseService
    ) {
    }

    get articleControl() {
        return this.articleEditForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getAllCategory();
        this.loadForms();
    }

    loadForms() {
        this.articleEditForm = this.formBuilder.group({
            id: [this.article.id],
            article_title: [this.article.article_title, [Validators.required, Validators.maxLength(255)]],
            category_id: [this.article.category_id, Validators.required],
            description: [this.article.description, Validators.required],
            file: [this.article.file_name],
            file_name: [this.article.file_name],
            file_extension: ['']
        });

        if (this.article.file_name) {
            this.articleEditForm.patchValue({file_extension: this.article.file_name.split('.').pop()});
        }

        this.isPageLoaded = true;
        setTimeout(() => {
            this.loadDropzone();
        });
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
                            that.articleEditForm.patchValue({file: reader.result});
                            that.articleEditForm.patchValue({file_extension: file.name.split('.').pop()});
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.articleEditForm.patchValue({file: null});
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
        if (this.articleEditForm.invalid) {
            return;
        }

        this.knowledgeBaseService.updateArticle(this.articleEditForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('knowledge_base.article.messages.update'), this.translate.instant('knowledge_base.title'));
                    this.event.emit({data});
                    this.onCancel();
                });
    }

    removeDropzoneFiles() {
        this.articleEditForm.patchValue({file: null});
        this.articleEditForm.patchValue({file_extension: null});
        this.articleEditForm.patchValue({file_name: null});
        this.logoDropzone.removeAllFiles(true);
        $('#dropZoneFile').html('');
    }

    getExtension(fileName) {
        return fileName.substr(fileName.lastIndexOf('.') + 1);
    }

    getAllCategory() {
        this.knowledgeBaseService.getAllCategory()
            .subscribe(data => {
                this.categories = data;
            });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditArticalModalRef.hide();
    }
}

