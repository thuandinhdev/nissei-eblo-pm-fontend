import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {AnnouncementService} from '../../../../../core/services/announcement.service';

@Component({
    selector: 'app-announcement-edit',
    templateUrl: './announcement-edit.component.html',
    styleUrls: ['./announcement-edit.component.scss'],
    providers: [DatePipe]
})

export class AnnouncementEditComponent implements OnInit {
    editAnnouncementForm: FormGroup;
    isFormSubmitted = false;
    isPageLoaded = false;
    loadDatepicker = false;
    announcementData: any;
    datepickerConfig = {
        dateInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-red'
    };

    constructor(
        public translate: TranslateService,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private announcementService: AnnouncementService
    ) {
        this.route.paramMap.subscribe(params => {
            this.getAnnouncementById(params.get('id'));
        });
    }

    get announcementControl() {
        return this.editAnnouncementForm.controls;
    }

    ngOnInit() {
    }

    getAnnouncementById(id) {
        this.announcementService.getById(id)
            .subscribe(
                data => {
                    this.announcementData = data;
                    this.loadForms();
                });
    }

    loadForms() {
        if (this.announcementData.status == 1) {
            this.announcementData.status = '1';
        } else {
            this.announcementData.status = '0';
        }

        if (this.announcementData.all_client == 0) {
            this.announcementData.all_client = false;
        } else {
            this.announcementData.all_client = true;
        }

        this.editAnnouncementForm = this.formBuilder.group({
            id: [this.announcementData.id],
            title: [this.announcementData.title, [Validators.required, Validators.maxLength(100)]],
            start_date: [new Date(this.announcementData.start_date), Validators.required],
            end_date: [new Date(this.announcementData.end_date), Validators.required],
            status: [this.announcementData.status, Validators.required],
            all_client: [this.announcementData.all_client],
            description: [this.announcementData.description],
        });
        this.isPageLoaded = true;
    }

    startDateChange(event: any) {
        this.editAnnouncementForm.patchValue({end_date: event});
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editAnnouncementForm.invalid) {
            return;
        }

        if (this.editAnnouncementForm.value.start_date instanceof Date) {
            this.editAnnouncementForm.value.start_date = this.datePipe.transform(this.editAnnouncementForm.value.start_date, 'yyyy-MM-dd h:mm:ss a');
        }
        if (this.editAnnouncementForm.value.end_date instanceof Date) {
            this.editAnnouncementForm.value.end_date = this.datePipe.transform(this.editAnnouncementForm.value.end_date, 'yyyy-MM-dd h:mm:ss a');
        }

        this.announcementService.update(this.editAnnouncementForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('announcements.messages.update'), this.translate.instant('announcements.title'));
                    this.router.navigate(['announcements']);
                });
    }

}
