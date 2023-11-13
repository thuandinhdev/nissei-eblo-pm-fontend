import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardChart1Component} from './pm-dashboard-chart1.component';

describe('PmDashboardChart1Component', () => {
    let component: PmDashboardChart1Component;
    let fixture: ComponentFixture<PmDashboardChart1Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardChart1Component]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardChart1Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
