import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardDefectsComponent} from './pm-dashboard-defects.component';

describe('PmDashboardDefectsComponent', () => {
    let component: PmDashboardDefectsComponent;
    let fixture: ComponentFixture<PmDashboardDefectsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardDefectsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardDefectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
