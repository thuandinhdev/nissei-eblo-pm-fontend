import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {HolidayService} from '../../../../../core/services/holiday.service';

import {Holiday} from '../../../../../shared/models/holiday.model';

@Component({
    selector: 'app-edit-holiday-modal',
    templateUrl: './edit-holiday-modal.component.html',
    styleUrls: ['./edit-holiday-modal.component.scss']
})

export class EditHolidayModalComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editHolidayForm: FormGroup;
    holiday: Holiday;
    isFormSubmitted = false;
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private holidayService: HolidayService
    ) {
    }

    get holidayControl() {
        return this.editHolidayForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loadForms();
    }

    loadForms() {
        this.editHolidayForm = this.formBuilder.group({
            id: [this.holiday.id],
            event_name: [this.holiday.event_name, [Validators.required, Validators.maxLength(50)]],
            description: [this.holiday.description],
            date: [new Date(this.holiday.date), Validators.required],
            location: [this.holiday.location],
            color: [this.holiday.color]
        });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editHolidayForm.invalid) {
            return;
        }

        this.holidayService.update(this.editHolidayForm.value).subscribe(data => {
            this.toastr.success(this.translate.instant('holidays.messages.update'), this.translate.instant('holidays.title'));
            this.event.emit({data: true});
            this.onCancel();
        }, error => {
            this.onCancel();
        });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

}
