import {Injectable, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {ErrorDialogComponent} from '../../shared/components/error-dialog/error-dialog.component';

@Injectable({
    providedIn: 'root'
})

export class ErrorDialogService implements OnInit {
    public modalRef: BsModalRef;

    constructor(private modalService: BsModalService) {
    }

    ngOnInit() {
    }

    openDialog(error: any, errorMessages: any) {
        let modalConfigs = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered animated zoomIn',
            initialState: {
                error: error,
                errorMessages: errorMessages
            }
        };

        this.modalRef = this.modalService.show(ErrorDialogComponent, modalConfigs);
        this.modalRef.content.onClose.subscribe(result => {
        });
    }
}
