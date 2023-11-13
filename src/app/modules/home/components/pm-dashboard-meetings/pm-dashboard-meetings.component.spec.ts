import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardMeetingsComponent} from './pm-dashboard-meetings.component';

describe('PmDashboardMeetingsComponent', () => {
    let component: PmDashboardMeetingsComponent;
    let fixture: ComponentFixture<PmDashboardMeetingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardMeetingsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardMeetingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
