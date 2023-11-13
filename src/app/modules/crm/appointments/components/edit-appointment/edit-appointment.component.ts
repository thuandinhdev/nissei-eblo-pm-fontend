import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';

import {Appointments} from '../../../../../shared/models/appointments.model';

import {ClientService} from '../../../../../core/services/client.service';
import {ProviderService} from '../../../../../core/services/provider.service';
import {AppointmentsService} from '../../../../../core/services/appointments.service';

import * as moment from 'moment';

@Component({
    selector: 'app-edit-appointment',
    templateUrl: './edit-appointment.component.html',
    styleUrls: ['./edit-appointment.component.scss']
})

export class EditAppointmentComponent implements OnInit {
    public event: EventEmitter<any> = new EventEmitter();
    public onClose: Subject<boolean>;
    editAppointmentForm: FormGroup;
    appointment: Appointments;
    providers: any;
    availabileSlots: any;
    clients = [];
    isFormSubmitted = false;
    isPageLoad = false;

    constructor(
        public translate: TranslateService,
        public bsEditModalRef: BsModalRef,
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private clientService: ClientService,
        private providerService: ProviderService,
        private appointmentsService: AppointmentsService
    ) {
    }

    get appointmentControl() {
        return this.editAppointmentForm.controls;
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.getClients();
    }

    loadForm() {
        this.editAppointmentForm = this.formBuilder.group({
            id: [this.appointment.id],
            title: [this.appointment.title, [Validators.required, Validators.maxLength(255)]],
            client_id: [this.appointment.client_id],
            provider_id: [this.appointment.provider_id, Validators.required],
            attendees: [this.appointment.attendees, Validators.required],
            start_date_time: [new Date(this.appointment.start_date_time), Validators.required],
            end_date_time: [new Date(this.appointment.end_date_time), Validators.required],
            status: [this.appointment.status, Validators.required],
            location: [this.appointment.location],
            note: [this.appointment.note]
        });

        this.checkAvailabilities();
        this.isPageLoad = true;
    }

    startDateChange(start_date) {
        this.editAppointmentForm.patchValue({end_date_time: new Date(start_date.value)});
        this.checkAvailabilities();
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

    changeProvider() {
        this.editAppointmentForm.patchValue({start_date_time: null});
        this.editAppointmentForm.patchValue({end_date_time: null});
        this.availabileSlots = [];
    }

    checkAvailabilities() {
        if (!this.editAppointmentForm.value.provider_id) {
            this.toastr.error(this.translate.instant('appointments.create.error_messages.message9'), this.translate.instant('appointments.title'));
            return false;
        }

        this.editAppointmentForm.value.start_date_time = moment(this.editAppointmentForm.value.start_date_time).format('YYYY-MM-DD HH:mm:ss');
        this.appointmentsService.getAppointmentAvailabilities(this.editAppointmentForm.value)
            .subscribe(
                data => {
                    this.availabileSlots = data;
                });
    }

    onSubmit() {
        this.isFormSubmitted = true;
        if (this.editAppointmentForm.invalid) {
            return;
        }

        this.editAppointmentForm.value.start_date_time = moment(this.editAppointmentForm.value.start_date_time).format('YYYY-MM-DD HH:mm:ss');
        this.editAppointmentForm.value.end_date_time = moment(this.editAppointmentForm.value.end_date_time).format('YYYY-MM-DD HH:mm:ss');

        this.appointmentsService.update(this.editAppointmentForm.value)
            .subscribe(
                data => {
                    this.toastr.success(this.translate.instant('appointments.messages.edit'), this.translate.instant('appointments.title'));
                    this.event.emit({data: true});
                    this.onCancel();
                });
    }

    onCancel() {
        this.onClose.next(false);
        this.bsEditModalRef.hide();
    }

}
