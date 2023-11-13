import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateTimesheetModalComponent} from './create-timesheet-modal.component';

describe('CreateTimesheetModalComponent', () => {
    let component: CreateTimesheetModalComponent;
    let fixture: ComponentFixture<CreateTimesheetModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateTimesheetModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateTimesheetModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
