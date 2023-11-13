import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {BsDatepickerViewMode} from 'ngx-bootstrap/datepicker';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {NgxRolesService} from 'ngx-permissions';
import {CalendarEvent, CalendarEventTitleFormatter, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth} from 'date-fns';
import {CustomEventTitleFormatter} from '../../../../../core/helpers/custom-event-title-formatter.provider';
import {Subject} from 'rxjs';
import Swal from 'sweetalert2';

import {AppointmentsService} from '../../../../../core/services/appointments.service';
import {ProviderService} from '../../../../../core/services/provider.service';
import {AuthenticationService} from '../../../../../core//services/authentication.service';

import {CreateAppointmentComponent} from '../../components/create-appointment/create-appointment.component';
import {EditAppointmentComponent} from '../../components/edit-appointment/edit-appointment.component';

import * as moment from 'moment';

@Component({
    selector: 'app-appointments',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
    providers: [{
        provide: CalendarEventTitleFormatter,
        useClass: CustomEventTitleFormatter
    }]
})

export class AppointmentsComponent implements OnInit {
    public modalRef: BsModalRef;
    AllCalendarEvents: any;
    isCalendarLoaded: boolean = false;
    appointments: any;
    providers: any;
    loginUser: any;
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    events: CalendarEvent[] = this.AllCalendarEvents;
    activeDayIsOpen: boolean = true;
    year: Date;
    minMode: BsDatepickerViewMode = 'month';
    filterDate: any;
    appoitmentFilterKey = 0;
    modalConfigs = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: false,
        class: 'inmodal modal-dialog-centered modal-md animated fadeIn'
    };

    constructor(
        public translate: TranslateService,
        public ngxRolesService: NgxRolesService,
        private http: HttpClient,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private providerService: ProviderService,
        private appointmentsService: AppointmentsService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.filterDate = moment(this.year).format('YYYY-MM');
        this.getProviders();
    }

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    addEvent(tasks): void {
        this.events = tasks;
        this.refreshView();
    }

    refreshView(): void {
        this.refresh.next();
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

    getAppointments(status = 0, date) {
        this.appointmentsService.getAll(status, date)
            .subscribe(
                data => {
                    this.appointments = data;
                    this.isCalendarLoaded = true;
                    this.setCalendarData();
                });
    }

    filterByStatus(status) {
        this.appoitmentFilterKey = status;
        this.getAppointments(status, this.filterDate);
    }

    appointmentYearChange($event: any) {
        this.filterDate = moment($event).format('YYYY-MM');
        this.getAppointments(this.appoitmentFilterKey, this.filterDate);
    }

    setCalendarData() {
        let eventsAll = [];
        let roleName = this.ngxRolesService.getRole('admin');
        let isAllowed = false;

        if ((roleName && roleName.name == 'admin') || this.loginUser.is_super_admin) {
            isAllowed = true;
        }

        this.appointments['data'].forEach(element => {
            let provider = this.getProvider(element.provider_id);

            if (provider) {

                if (element.user_id == this.loginUser.id) {
                    isAllowed = true;
                }

                if (isAllowed) {
                    eventsAll.push({
                        start: new Date(element.start_date_time),
                        end: new Date(element.end_date_time),
                        title: '(' + moment(element.start_date_time).format(this.loginUser.settings.date_time_format) + ' - ' + moment(element.end_date_time).format(this.loginUser.settings.date_time_format) + ') ' + provider.firstname + ' ' + provider.lastname + ' / ' + element.title,
                        allDay: true,
                        cssClass: 'event_' + element.id,
                        color: {
                            primary: provider.color,
                            secondary: provider.color
                        },
                        actions: [
                            {
                                label: '<i class="fa fa-fw fa-pencil"></i>',
                                onClick: ({event}: { event: CalendarEvent }): void => {
                                    this.openAppointmentEditModal(event);
                                }
                            }, {
                                label: '<i class="fa fa-fw fa-times"></i>',
                                onClick: ({event}: { event: CalendarEvent }): void => {
                                    this.deleteAppointment(event);
                                }
                            }
                        ]
                    });
                } else {
                    eventsAll.push({
                        start: new Date(element.start_date_time),
                        end: new Date(element.end_date_time),
                        title: '(' + moment(element.start_date_time).format(this.loginUser.settings.date_time_format) + ' - ' + moment(element.end_date_time).format(this.loginUser.settings.date_time_format) + ') ' + provider.firstname + ' ' + provider.lastname + ' / ' + element.title,
                        allDay: true,
                        cssClass: 'event_' + element.id,
                        color: {
                            primary: provider.color,
                            secondary: provider.color
                        },
                        actions: []
                    });
                }
            }
        });

        this.addEvent(eventsAll);
        this.AllCalendarEvents = eventsAll;
    }

    getProvider(providerId) {
        for (let iRow in this.providers) {
            if (this.providers[iRow].id == providerId) {
                return this.providers[iRow];
            }
        }
    }

    getAppointment(id) {
        for (let iRow in this.appointments['data']) {
            if (this.appointments['data'][iRow].id == id) {
                return this.appointments['data'][iRow];
            }
        }
    }

    getProviders() {
        this.providerService.getAll()
            .subscribe(
                data => {
                    this.providers = data;
                    this.getAppointments(this.appoitmentFilterKey, this.filterDate);
                });
    }

    openAppointmentCreateModal() {
        this.modalRef = this.modalService.show(CreateAppointmentComponent, this.modalConfigs);
        this.modalRef.content.event.subscribe(data => {
            this.getAppointments(this.appoitmentFilterKey, this.filterDate);
        });
    }

    openAppointmentEditModal(event) {
        let appointment = this.getAppointment(parseInt(this.getSecondPartString(event.cssClass)));
        let modalConfig = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false,
            class: 'inmodal modal-dialog-centered modal-md animated fadeIn',
            initialState: {
                appointment: appointment
            }
        };

        this.modalRef = this.modalService.show(EditAppointmentComponent, modalConfig);
        this.modalRef.content.event.subscribe(data => {
            this.getAppointments(this.appoitmentFilterKey, this.filterDate);
        });
    }

    deleteAppointment(event) {
        let appointmentId = parseInt(this.getSecondPartString(event.cssClass));

        Swal.fire({
            title: this.translate.instant('common.swal.title'),
            text: this.translate.instant('common.swal.text'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: this.translate.instant('common.swal.confirmButtonText'),
            cancelButtonText: this.translate.instant('common.swal.cancelButtonText')
        }).then((result) => {
            if (result.value) {
                this.appointmentsService.delete(appointmentId)
                    .subscribe(
                        data => {
                            this.toastr.success(this.translate.instant('appointments.messages.delete'), this.translate.instant('appointments.title'));
                            this.getAppointments(this.appoitmentFilterKey, this.filterDate);
                        });
            }
        });
    }

    getSecondPartString(str) {
        return str.split('_')[1];
    }
}
