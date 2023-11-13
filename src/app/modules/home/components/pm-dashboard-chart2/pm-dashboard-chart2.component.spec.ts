import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardChart2Component} from './pm-dashboard-chart2.component';

describe('PmDashboardChart2Component', () => {
    let component: PmDashboardChart2Component;
    let fixture: ComponentFixture<PmDashboardChart2Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardChart2Component]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardChart2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
