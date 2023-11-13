import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {Project} from './../../../../../shared/models/project.model';

import {ProjectAttachmentService} from './../../../../../core/services/project-attachment.service';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-create-attachment-modal',
    templateUrl: './create-attachment-modal.component.html',
    styleUrls: ['./create-attachment-modal.component.scss']
})

export class CreateAttachmentModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createAttachmentForm: FormGroup;
    projectId: Project;
    fileName: any;
    isFormSubmitted = false;
    isPageLoaded = false;
    isfileUploded = false;
    isfileLoaded = true;

    @ViewChild('logodropzone', {static: false}) logodropzone: ElementRef;

    constructor(
        public translate: TranslateService,
        public bsCreateAttachmentModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private projectAttachmentService: ProjectAttachmentService
    ) {
    }

    get attachment() {
        return this.createAttachmentForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();
    }

    loadForms() {
        this.createAttachmentForm = this.formBuilder.group({
            project_id: [this.projectId],
            file_name: ['', [Validators.required, Validators.maxLength(255)]],
            file: ['', Validators.required],
            file_extension: [this.fileName],
            file_description: ['']
        });

        setTimeout(() => {
            this.loadDropzone();
        });
    }

    loadDropzone() {
        let that = this;
        new Dropzone(this.logodropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
            // acceptedFiles: '*',
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
                        that.fileName = file.name;
                        if (that.fileName) {
                            that.fileName = that.fileName.split('.').pop();
                        }
                        reader.onload = (e) => {
                            that.createAttachmentForm.patchValue({file: reader.result});
                            that.createAttachmentForm.patchValue({file_extension: that.fileName});
                        };
                        reader.readAsDataURL(file);
                    }
                });

                this.on('removedfile', function (file) {
                    that.createAttachmentForm.patchValue({file: null});
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
        this.isfileUploded = true;
        this.isfileLoaded = false;
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createAttachmentForm.invalid) {
            return;
        }

        this.projectAttachmentService.create(this.createAttachmentForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('attachments.messages.create'), this.translate.instant('attachments.title'));
                    this.event.emit({data});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateAttachmentModalRef.hide();
    }

}
