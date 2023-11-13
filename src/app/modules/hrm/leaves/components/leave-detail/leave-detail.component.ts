import {Component, EventEmitter, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Subject} from 'rxjs';

import {LeaveService} from '../../../../../core/services/leave.service';

@Component({
    selector: 'app-leave-detail',
    templateUrl: './leave-detail.component.html',
    styleUrls: ['./leave-detail.component.scss']
})

export class LeaveDetailComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    public modalRef: BsModalRef;
    leave: any;
    leavesData: any;
    isPageLoad = false;

    constructor(
        public bsModalRef1: BsModalRef,
        private modalService: BsModalService,
        private leaveService: LeaveService
    ) {
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getLeaves();
    }

    getLeaves() {
        this.leaveService.getLeaveReportDetails(this.leave)
            .subscribe(
                data => {
                    this.leavesData = data;
                    this.isPageLoad = true;
                });
    }

    onCancel() {
        this.event.emit({data: true});
        this.onClose.next(false);
        this.bsModalRef1.hide();
    }

}
