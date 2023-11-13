import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardActivityComponent} from './pm-dashboard-activity.component';

describe('PmDashboardActivityComponent', () => {
    let component: PmDashboardActivityComponent;
    let fixture: ComponentFixture<PmDashboardActivityComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardActivityComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardActivityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
