import {ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {addDays, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {Subject} from 'rxjs';

import {colors} from './../../../../../core/helpers/pm-helper';

@Component({
    selector: 'app-project-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './project-calendar.component.html',
    styleUrls: ['./project-calendar.component.scss']
})

export class ProjectCalendarComponent implements OnInit {
    @Input() project;
    @Input() loginUser;
    today: Date = new Date();
    AllCalendarEvents: any;
    isCalendarLoaded: boolean = false;
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    events: CalendarEvent[] = this.AllCalendarEvents;
    activeDayIsOpen: boolean = true;

    @ViewChild('modalContent', {static: true}) modalContent: TemplateRef<any>;

    ngOnInit() {
        this.setCalendarData();
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

    setCalendarData() {
        let eventsAll = [];

        eventsAll.push({
            start: subDays(startOfDay(new Date(this.project.start_date)), 0),
            end: addDays(new Date(this.project.end_date), 0),
            title: 'Project:- ' + this.project.project_name,
            color: colors.red,
            allDay: true
        });

        this.project.tasks.forEach(element => {
            eventsAll.push({
                start: subDays(startOfDay(new Date(element.task_start_date)), 0),
                end: addDays(new Date(element.task_end_date), 0),
                title: 'Task:- ' + element.name,
                color: colors.blue,
                allDay: true
            });
        });

        this.project.defects.forEach(element => {
            eventsAll.push({
                start: subDays(startOfDay(new Date(element.start_date)), 0),
                end: addDays(new Date(element.end_date), 0),
                title: 'Defect:- ' + element.defect_name,
                color: colors.orange,
                allDay: true
            });
        });

        this.project.incidents.forEach(element => {
            eventsAll.push({
                start: subDays(startOfDay(new Date(element.start_date)), 0),
                end: addDays(new Date(element.end_date), 0),
                title: 'Incident:- ' + element.incident_name,
                color: colors.purple,
                allDay: true
            });
        });

        this.addEvent(eventsAll);
        this.AllCalendarEvents = eventsAll;
    }

}
