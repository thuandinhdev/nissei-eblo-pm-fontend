import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditTimesheetModalComponent} from './edit-timesheet-modal.component';

describe('EditTimesheetModalComponent', () => {
    let component: EditTimesheetModalComponent;
    let fixture: ComponentFixture<EditTimesheetModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditTimesheetModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditTimesheetModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
