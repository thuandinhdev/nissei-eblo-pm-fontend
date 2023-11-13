import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardAnnouncementsComponent} from './pm-dashboard-announcements.component';

describe('PmDashboardAnnouncementsComponent', () => {
    let component: PmDashboardAnnouncementsComponent;
    let fixture: ComponentFixture<PmDashboardAnnouncementsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardAnnouncementsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardAnnouncementsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
