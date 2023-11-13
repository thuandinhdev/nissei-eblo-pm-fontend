import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {KnowledgeBaseService} from './../../../../../../core/services/knowledge-base.service';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-create-artical-modal',
    templateUrl: './create-artical-modal.component.html',
    styleUrls: ['./create-artical-modal.component.scss']
})

export class CreateArticalModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    articleCreateForm: FormGroup;
    isFormSubmitted = false;
    isPageLoaded = false;
    categories = [];

    @ViewChild('logodropzone', {static: true}) logodropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        private formBuilder: FormBuilder,
        private bsCreateArticalModalRef: BsModalRef,
        private toastr: ToastrService,
        private knowledgeBaseService: KnowledgeBaseService
    ) {
    }

    get articleControl() {
        return this.articleCreateForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();
        this.loadDropzone();
    }

    loadForms() {
        this.articleCreateForm = this.formBuilder.group({
            article_title: ['', [Validators.required, Validators.maxLength(255)]],
            category_id: [null, Validators.required],
            description: ['', Validators.required],
            file: [''],
            file_extension: ['']
        });

        this.getAllCategory();
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
                            that.articleCreateForm.patchValue({file: reader.result});
                            that.articleCreateForm.patchValue({file_extension: file.name.split('.').pop()});
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.articleCreateForm.patchValue({file: null});
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
        if (this.articleCreateForm.invalid) {
            return;
        }

        this.knowledgeBaseService.createArtical(this.articleCreateForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('knowledge_base.article.messages.create'), this.translate.instant('knowledge_base.title'));
                    this.event.emit({data});
                    this.onCancel();
                });
    }

    getAllCategory() {
        this.knowledgeBaseService.getAllCategory()
            .subscribe(data => {
                this.categories = data;
                this.isPageLoaded = true;
            });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateArticalModalRef.hide();
    }
}

