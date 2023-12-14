import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import * as moment from 'moment';

import {TimesheetService} from '../../../../core/services/timesheet.service';
import {Timesheet} from '../../../../shared/models/timesheet.model';

@Component({
    selector: 'app-edit-timesheet-modal',
    templateUrl: './edit-timesheet-modal.component.html',
    styleUrls: ['./edit-timesheet-modal.component.scss']
})

export class EditTimesheetModalComponent implements OnInit {
    public onClose: Subject<boolean>;
    public event: EventEmitter<any> = new EventEmitter();
    editTimesheetForm: FormGroup;
    timesheet: Timesheet;
    isFormSubmitted = false;

    constructor(
        public translate: TranslateService,
        public bsEditRoleModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private timesheetService: TimesheetService,
    ) {
    }

    get timesheetControl() {
        return this.editTimesheetForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForm();
    }

    loadForm() {
        this.editTimesheetForm = this.formBuilder.group({
            id: [this.timesheet.id],
            date: [new Date(this.timesheet.start_time), Validators.required],
            hour: [this.timesheet.hour_time, Validators.required],
            note: [this.timesheet.note],
        });
    }

    startTimeChange(start_time) {
        this.editTimesheetForm.patchValue({end_time: new Date(start_time.value)});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editTimesheetForm.invalid) {
            return;
        }

        this.editTimesheetForm.value.start_time = moment(this.editTimesheetForm.value.date).format('YYYY-MM-DD') + " 00:00:00";
        this.editTimesheetForm.value.end_time = moment(this.editTimesheetForm.value.date).format('YYYY-MM-DD' + " "+this.editTimesheetForm.value.hour + ":00");
        // this.editTimesheetForm.value.start_time = moment(this.editTimesheetForm.value.start_time).format('YYYY-MM-DD HH:mm:ss');
        // this.editTimesheetForm.value.end_time = moment(this.editTimesheetForm.value.end_time).format('YYYY-MM-DD HH:mm:ss');

        // --
        // Check dates
        if ((this.editTimesheetForm.value.start_time == this.editTimesheetForm.value.end_time) || (this.editTimesheetForm.value.start_time > this.editTimesheetForm.value.end_time)) {
            this.toastr.error(this.translate.instant('timesheet.create.error_messages.message3'), this.translate.instant('timesheet.title'));
            return false;
        }

        this.timesheetService.update(this.editTimesheetForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('timesheet.messages.update'), this.translate.instant('timesheet.title'));
            this.event.emit({data: true});
            this.onCancel();
        }, error => {
            this.onCancel();
        });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditRoleModalRef.hide();
    }

}
