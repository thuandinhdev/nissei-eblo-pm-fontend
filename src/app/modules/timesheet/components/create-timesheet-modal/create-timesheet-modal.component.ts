import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import * as moment from 'moment';

import {TimesheetService} from '../../../../core/services/timesheet.service';

@Component({
    selector: 'app-create-timesheet-modal',
    templateUrl: './create-timesheet-modal.component.html',
    styleUrls: ['./create-timesheet-modal.component.scss']
})

export class CreateTimesheetModalComponent implements OnInit {
    public onClose: Subject<boolean>;
    public event: EventEmitter<any> = new EventEmitter();
    createTimesheetForm: FormGroup;
    isFormSubmitted = false;
    params: any;

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private timesheetService: TimesheetService,
    ) {
    }

    get timesheetControl() {
        return this.createTimesheetForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();
    }

    loadForms() {
        this.createTimesheetForm = this.formBuilder.group({
            project_id: [this.params.project_id],
            module_id: [this.params.module_id, Validators.required],
            module_related_id: [this.params.module_related_id],
            start_time: [new Date(), Validators.required],
            end_time: [new Date(), Validators.required],
            note: [null],
        });
    }

    startTimeChange(start_time) {
        this.createTimesheetForm.patchValue({end_time: new Date(start_time.value)});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createTimesheetForm.invalid) {
            return;
        }

        this.createTimesheetForm.value.start_time = moment(this.createTimesheetForm.value.start_time).format('YYYY-MM-DD HH:mm:ss');
        this.createTimesheetForm.value.end_time = moment(this.createTimesheetForm.value.end_time).format('YYYY-MM-DD HH:mm:ss');

        // Check dates.
        if ((this.createTimesheetForm.value.start_time == this.createTimesheetForm.value.end_time) || (this.createTimesheetForm.value.start_time > this.createTimesheetForm.value.end_time)) {
            this.toastr.error(this.translate.instant('timesheet.create.error_messages.message3'), this.translate.instant('timesheet.title'));
            return false;
        }

        this.timesheetService.create(this.createTimesheetForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('timesheet.messages.create'), this.translate.instant('timesheet.title'));
            this.event.emit({data: true});
            this.onCancel();
        }, error => {
            this.event.emit({data: true});
            this.onCancel();
        });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

}
