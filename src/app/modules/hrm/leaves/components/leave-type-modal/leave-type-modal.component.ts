import {Component, EventEmitter, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-leave-type-modal',
    templateUrl: './leave-type-modal.component.html',
    styleUrls: ['./leave-type-modal.component.scss']
})

export class LeaveTypeModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    public modalRef: BsModalRef;

    constructor(
        public bsModalRef1: BsModalRef,
        private modalService: BsModalService
    ) {
    }

    ngOnInit() {
        this.onClose = new Subject();
    }

    onCancel() {
        this.event.emit({data: true});
        this.onClose.next(false);
        this.bsModalRef1.hide();
    }

}
