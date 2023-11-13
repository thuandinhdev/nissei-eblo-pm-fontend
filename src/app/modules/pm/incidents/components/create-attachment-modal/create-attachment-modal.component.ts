import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {Incident} from 'src/app/shared/models/incident.model';

import {IncidentAttachmentService} from './../../../../../core/services/incident-attachment.service';

import * as Dropzone from 'dropzone';

@Component({
    selector: 'app-create-attachment-modal',
    templateUrl: './create-attachment-modal.component.html',
    styleUrls: ['./create-attachment-modal.component.scss']
})

export class CreateAttachmentModalComponent implements OnInit {
    @ViewChild('logodropzone', {static: false}) logodropzone: ElementRef;
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createAttachmentForm: FormGroup;
    incidentId: Incident;
    fileName: any;
    isFormSubmitted = false;
    isPageLoaded = false;
    isfileUploded = false;
    isfileLoaded = true;

    constructor(
        public translate: TranslateService,
        public bsCreateAttachmentModalRef: BsModalRef,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private incidentAttachmentService: IncidentAttachmentService
    ) {
    }

    get attachment() {
        return this.createAttachmentForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();

        setTimeout(() => {
            this.loadDropzone();
        });
    }

    loadForms() {
        this.createAttachmentForm = this.formBuilder.group({
            incident_id: [this.incidentId],
            file_name: ['', [Validators.required, Validators.maxLength(255)]],
            file: ['', Validators.required],
            file_extension: [this.fileName],
            file_description: ['']
        });
    }

    loadDropzone() {
        let that = this;
        new Dropzone(this.logodropzone.nativeElement, {
            url: 'https://httpbin.org/post',
            maxFiles: 1,
            clickable: true,
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

        this.incidentAttachmentService.create(this.createAttachmentForm.value)
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
