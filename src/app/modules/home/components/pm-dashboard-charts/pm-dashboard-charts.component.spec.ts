import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardChartsComponent} from './pm-dashboard-charts.component';

describe('PmDashboardChartsComponent', () => {
    let component: PmDashboardChartsComponent;
    let fixture: ComponentFixture<PmDashboardChartsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardChartsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardChartsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
