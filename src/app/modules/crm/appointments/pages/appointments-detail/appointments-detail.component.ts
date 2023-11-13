import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

import {AppointmentsService} from '../../../../../core/services/appointments.service';
import {AuthenticationService} from 'src/app/core/services/authentication.service';

import {appointment_status_key_value} from './../../../../../core/helpers/crm-helper';

@Component({
    selector: 'app-appointments-detail',
    templateUrl: './appointments-detail.component.html',
    styleUrls: ['./appointments-detail.component.scss']
})

export class AppointmentsDetailComponent implements OnInit {
    appointment: any;
    loginUser: any;
    isPageLoaded = false;
    appointmentStatusKeyValue = appointment_status_key_value;

    constructor(
        public translate: TranslateService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private appointmentsService: AppointmentsService,
        private authenticationService: AuthenticationService
    ) {
        this.route.paramMap.subscribe(params => {
            this.getById(params.get('id'));
        });
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
    }

    getById(appointmentId) {
        this.appointmentsService.getById(appointmentId).subscribe(data => {
            this.appointment = data;
            this.isPageLoaded = true;
        });
    }

    getTranslateStatus(statusKey) {
        return this.appointmentStatusKeyValue[statusKey];
    }

    changeAppointmentStatus(appointmentId: any, status: any) {
        this.appointmentsService.changeStatus({id: appointmentId, status: status.id}).subscribe(data => {
            this.toastr.success(this.translate.instant('appointments.messages.status'), this.translate.instant('appointments.title'));
        });
    }

}
