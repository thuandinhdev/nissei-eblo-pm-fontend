import {Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth, startOfDay} from 'date-fns';
import {Subject} from 'rxjs';

import {LeaveService} from '../../../../../core/services/leave.service';
import {AuthenticationService} from '../../../../../core/services/authentication.service';

@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.scss']
})

export class CalendarViewComponent implements OnInit {
    allCalendarEvents: any;
    isCalendarLoaded: boolean = false;
    leaves: any;
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    events: CalendarEvent[] = this.allCalendarEvents;
    activeDayIsOpen: boolean = true;
    loginUser: any;

    constructor(
        private leaveService: LeaveService,
        private authenticationService: AuthenticationService,
    ) {
        this.authenticationService.loginUser.subscribe(x => this.loginUser = x);
    }

    ngOnInit() {
        this.getLeaves();
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

    addEvent(leaves): void {
        this.events = leaves;
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

    getLeaves() {
        this.leaveService.getCalendarLeaves().subscribe(
            data => {
                this.leaves = data;
                this.setCalendarData();
            });
    }

    setCalendarData() {
        let eventsAll = [];

        this.leaves.forEach(element => {
            eventsAll.push({
                start: startOfDay(new Date(element.leave_date)),
                title: element.user.full_name + ' - ' + element.leave_type.leave_type + ' - ' + element.reason,
                color: {
                    primary: element.leave_type.color,
                    secondary: element.leave_type.color
                }
            });
        });

        this.addEvent(eventsAll);
        this.allCalendarEvents = eventsAll;
    }
}
