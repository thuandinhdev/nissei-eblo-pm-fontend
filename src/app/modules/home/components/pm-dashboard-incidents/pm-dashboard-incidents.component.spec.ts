import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardIncidentsComponent} from './pm-dashboard-incidents.component';

describe('PmDashboardIncidentsComponent', () => {
    let component: PmDashboardIncidentsComponent;
    let fixture: ComponentFixture<PmDashboardIncidentsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardIncidentsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardIncidentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
