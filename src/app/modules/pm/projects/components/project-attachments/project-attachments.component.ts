import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

import {CreateAttachmentModalComponent} from '../../components/create-attachment-modal/create-attachment-modal.component';

import {ProjectAttachmentService} from '../../../../../core/services/project-attachment.service';

@Component({
    selector: 'app-project-attachments',
    templateUrl: './project-attachments.component.html',
    styleUrls: ['./project-attachments.component.scss']
})

export class ProjectAttachmentsComponent implements OnInit {
    public modalRef: BsModalRef;
    @Input() project;
    @Input() loginUser: any;
    @Input() permissions: any;
    @Input() apiUrl;
    attachments: any;
    modalConfigs = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
        initialState: {
            projectId: this.route.snapshot.params.id,
        }
    };

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private projectAttachmentService: ProjectAttachmentService
    ) {
        this.getAllAttachment(this.route.snapshot.params.id);
    }

    ngOnInit() {
    }

    getAllAttachment(projectId, isLoad = true) {
        this.projectAttachmentService.getAllAttachmentById(projectId).subscribe(data => {
            this.attachments = data;
            this.getFiles();
        });
    }

    getFiles() {
        for (let iRow in this.attachments) {
            switch (this.attachments[iRow].file_extension) {
                case 'txt':
                    this.attachments[iRow].icon = 'fa fa-file-text';
                    break;
                case 'mp3':
                case 'wav':
                case 'raw':
                case 'tta':
                    this.attachments[iRow].icon = 'fa fa-music';
                    break;
                case 'webm':
                case 'flv':
                case 'ogg':
                case 'mov':
                case 'mp4':
                case 'm4p':
                case 'mpeg':
                case 'f4v':
                case '3gp':
                    this.attachments[iRow].icon = 'fa fa-film';
                    break;
                case 'pdf':
                    this.attachments[iRow].icon = 'fa fa-file-pdf-o';
                    break;
                case 'jpeg':
                case 'jpg':
                case 'png':
                case 'gif':
                case 'bmp':
                case 'svg':
                    this.attachments[iRow].isImageFile = true;
                    break;
                default:
                    this.attachments[iRow].isImageFile = false;
                    this.attachments[iRow].icon = 'fa fa-file';
                    break;
            }
        }
    }

    attachmentDelete(attachmentId) {
        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.projectAttachmentService.delete(attachmentId)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('attachments.messages.delete'), this.translate.instant('projects.title'));
                            this.getAllAttachment(this.project.id, false);
                        });
            }
        });
    }

    openAttachmentCreateModal() {
        this.modalRef = this.modalService.show(CreateAttachmentModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getAllAttachment(this.project.id, false);
        });
    }

}
