import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {ClientService} from '../../../../../core/services/client.service';
import {ProviderService} from '../../../../../core/services/provider.service';
import {AppointmentsService} from '../../../../../core/services/appointments.service';

import * as moment from 'moment';

@Component({
    selector: 'app-create-appointment',
    templateUrl: './create-appointment.component.html',
    styleUrls: ['./create-appointment.component.scss']
})

export class CreateAppointmentComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    createAppointmentForm: FormGroup;
    availabileSlots: any;
    providers: any;
    minDate = new Date;
    clients = [];
    isFormSubmitted = false;
    isPageLoad = false;

    constructor(
        public translate: TranslateService,
        public bsCreateModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private clientService: ClientService,
        private providerService: ProviderService,
        private appointmentsService: AppointmentsService
    ) {
    }

    get appointmentControl() {
        return this.createAppointmentForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getClients();
    }

    loadForm() {
        this.createAppointmentForm = this.formBuilder.group({
            title: [null, [Validators.required, Validators.maxLength(255)]],
            client_id: [null],
            provider_id: [null, Validators.required],
            attendees: [null, Validators.required],
            start_date_time: [null, Validators.required],
            end_date_time: [null, Validators.required],
            location: [''],
            note: ['']
        });

        this.isPageLoad = true;
        this.checkAvailabilities(false);
    }

    startDateChange(startDate) {
        this.createAppointmentForm.patchValue({end_date_time: new Date(startDate.value)});
        this.checkAvailabilities(true);
    }

    getClients() {
        this.clientService.getAll()
            .subscribe(
                data => {
                    this.clients = data;
                    this.getProviders();
                });
    }

    getProviders() {
        this.providerService.getAll()
            .subscribe(
                data => {
                    this.providers = data;
                    this.loadForm();
                });
    }

    checkAvailabilities(isValid) {
        if (!this.createAppointmentForm.value.provider_id && isValid) {
            this.toastr.error(this.translate.instant('appointments.create.error_messages.message9'), this.translate.instant('appointments.title'));
            return false;
        }

        this.createAppointmentForm.value.start_date_time = moment(this.createAppointmentForm.value.start_date_time).format('YYYY-MM-DD HH:mm:ss');
        this.appointmentsService.getAppointmentAvailabilities(this.createAppointmentForm.value)
            .subscribe(
                data => {
                    this.availabileSlots = data;
                });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.createAppointmentForm.invalid) {
            return;
        }

        this.createAppointmentForm.value.start_date_time = moment(this.createAppointmentForm.value.start_date_time).format('YYYY-MM-DD HH:mm:ss');
        this.createAppointmentForm.value.end_date_time = moment(this.createAppointmentForm.value.end_date_time).format('YYYY-MM-DD HH:mm:ss');

        this.appointmentsService.create(this.createAppointmentForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('appointments.messages.create'), this.translate.instant('appointments.title'));
                    this.event.emit({data: true});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsCreateModalRef.hide();
    }

}
