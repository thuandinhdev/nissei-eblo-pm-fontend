import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardTasksComponent} from './pm-dashboard-tasks.component';

describe('PmDashboardTasksComponent', () => {
    let component: PmDashboardTasksComponent;
    let fixture: ComponentFixture<PmDashboardTasksComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardTasksComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardTasksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
