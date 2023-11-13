import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardWidgetsComponent} from './pm-dashboard-widgets.component';

describe('PmDashboardWidgetsComponent', () => {
    let component: PmDashboardWidgetsComponent;
    let fixture: ComponentFixture<PmDashboardWidgetsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardWidgetsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardWidgetsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
