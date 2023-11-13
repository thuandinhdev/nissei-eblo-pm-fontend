import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {CalendarDateFormatter, CalendarEvent, CalendarEventTitleFormatter, DateFormatterParams} from 'angular-calendar';
import {DatePipe} from '@angular/common';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
    constructor(@Inject(LOCALE_ID) private locale: string) {
        super();
    }

    // you can override any of the methods defined in the parent class

    month(event: CalendarEvent): string {
        return `${event.title}`;
    }

    week(event: CalendarEvent): string {
        return `<b>${new DatePipe(this.locale).transform(
            event.start,
            'h:m a',
            this.locale
        )}</b> ${event.title}`;
    }

    day(event: CalendarEvent): string {
        return `<b>${new DatePipe(this.locale).transform(
            event.start,
            'h:m a',
            this.locale
        )}</b> ${event.title}`;
    }
}

export class CustomDateFormatter extends CalendarDateFormatter {
    // you can override any of the methods defined in the parent class

    public dayViewHour({date, locale}: DateFormatterParams): string {
        return new DatePipe(locale).transform(date, 'HH:mm', locale);
    }

    public weekViewHour({date, locale}: DateFormatterParams): string {
        return this.dayViewHour({date, locale});
    }
}

