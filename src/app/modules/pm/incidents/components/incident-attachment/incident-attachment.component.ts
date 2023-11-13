import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import Swal from 'sweetalert2';

import {IncidentAttachmentService} from '../../../../../core/services/incident-attachment.service';

import {CreateAttachmentModalComponent} from '../../components/create-attachment-modal/create-attachment-modal.component';

import {environment} from '../../../../../../environments/environment';

@Component({
    selector: 'app-incident-attachment',
    templateUrl: './incident-attachment.component.html',
    styleUrls: ['./incident-attachment.component.scss']
})

export class IncidentAttachmentComponent implements OnInit {
    public modalRef: BsModalRef;
    @Input() incident: any;
    @Input() loginUser: any;
    @Input() permission: any;
    attachments: any;
    modalConfigs = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
        initialState: {
            incidentId: this.route.snapshot.params.id,
        }
    };
    private apiUrl = environment.apiUrl;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private incidentAttachmentService: IncidentAttachmentService
    ) {
        this.getAttachments(this.route.snapshot.params.id);
    }

    ngOnInit() {
    }

    getAttachments(incidentId, isLoad = true) {
        this.incidentAttachmentService.getAllAttachmentById(incidentId).subscribe(data => {
                this.attachments = data;
                this.getFiles();
            }
        );
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

    openAttachmentCreateModal() {
        this.modalRef = this.modalService.show(CreateAttachmentModalComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getAttachments(this.incident.id, false);
        });
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
                this.incidentAttachmentService.delete(attachmentId).subscribe(data => {
                    this.toastr.success(this.translate.instant('attachments.messages.delete'), this.translate.instant('incidents.title'));
                    this.getAttachments(this.incident.id, false);
                });
            }
        });
    }

}
