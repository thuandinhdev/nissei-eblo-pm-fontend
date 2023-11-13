import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CalendarDateFormatter, CalendarEvent, CalendarView} from 'angular-calendar';
import {addDays, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {Subject} from 'rxjs';

import {MeetingService} from './../../../../core/services/meeting.service';
import {HolidayService} from './../../../../core/services/holiday.service';
import {ProjectService} from './../../../../core/services/project.service';
import {DefectService} from './../../../../core/services/defect.service';
import {IncidentService} from './../../../../core/services/incident.service';
import {TaskService} from './../../../../core/services/task.service';
import {AuthenticationService} from './../../../../core/services/authentication.service';

import {colors} from './../../../../core/helpers/pm-helper';
import {CustomDateFormatter} from './../../../../core/helpers/custom-event-title-formatter.provider';

@Component({
    selector: 'app-calendar-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './calendar-list.component.html',
    styleUrls: ['./calendar-list.component.scss'],
    providers: [{
        provide: CalendarDateFormatter,
        useClass: CustomDateFormatter
    }]
})

export class CalendarListComponent implements OnInit {
    AllCalendarEvents: any;
    isCalendarLoaded: boolean = false;
    tasks: any;
    incidents: any;
    defects: any;
    holidays: any;
    meetings: any;
    loginUser: any;
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    events: CalendarEvent[] = this.AllCalendarEvents;
    activeDayIsOpen: boolean = true;

    constructor(
        private projectService: ProjectService,
        private taskService: TaskService,
        private holidayService: HolidayService,
        private MeetingService: MeetingService,
        private authenticationService: AuthenticationService,
        private defectService: DefectService,
        private incidentService: IncidentService
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.getTasks();
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
        this.isCalendarLoaded = true;
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

    getTasks() {
        this.taskService.getCalendarTasks().subscribe(
            data => {
                this.tasks = data;
                this.getDefects();
            });
    }

    getDefects() {
        this.defectService.getDefectForCalendar()
            .subscribe(
                data => {
                    this.defects = data;
                    this.getIncidents();
                });
    }

    getIncidents() {
        this.incidentService.getIncidentForCalendar()
            .subscribe(
                data => {
                    this.incidents = data;
                    this.getMeetings();
                });
    }

    getMeetings() {
        this.MeetingService.getCalendarMeetings().subscribe(
            data => {
                this.meetings = data;
                this.getHolidays();
            });
    }

    getHolidays() {
        this.holidayService.yearAllHolidays(new Date().getFullYear()).subscribe(
            data => {
                this.holidays = data;
                this.setCalendarData();
            });
    }

    setCalendarData() {
        let eventsAll = [];

        this.tasks.forEach(element => {
            eventsAll.push({
                start: subDays(startOfDay(new Date(element.task_start_date)), 0),
                end: addDays(new Date(element.task_end_date), 0),
                title: 'Task:- ' + element.name,
                color: colors.blue,
                allDay: true
            });
        });

        this.defects.forEach(element => {
            eventsAll.push({
                start: subDays(startOfDay(new Date(element.start_date)), 0),
                end: addDays(new Date(element.end_date), 0),
                title: 'Defect:- ' + element.defect_name,
                color: colors.orange,
                allDay: true
            });
        });

        this.incidents.forEach(element => {
            eventsAll.push({
                start: subDays(startOfDay(new Date(element.start_date)), 0),
                end: addDays(new Date(element.end_date), 0),
                title: 'Incident:- ' + element.incident_name,
                color: colors.purple,
                allDay: true
            });
        });

        this.meetings.forEach(element => {
            eventsAll.push({
                start: subDays(startOfDay(new Date(element.start_date)), 0),
                end: addDays(new Date(element.end_date), 0),
                title: 'Meeting:- ' + element.title,
                color: colors.yellow,
                allDay: true
            });
        });

        this.holidays.forEach(element => {
            eventsAll.push({
                start: startOfDay(new Date(element.date)),
                title: 'Holiday:- ' + element.event_name,
                color: {
                    primary: element.color,
                    secondary: element.color
                }
            });
        });

        this.addEvent(eventsAll);
        this.AllCalendarEvents = eventsAll;
    }

}
