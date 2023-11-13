import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardEstimatesComponent} from './pm-dashboard-estimates.component';

describe('PmDashboardEstimatesComponent', () => {
    let component: PmDashboardEstimatesComponent;
    let fixture: ComponentFixture<PmDashboardEstimatesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardEstimatesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardEstimatesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
