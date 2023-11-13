import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardProjectsComponent} from './pm-dashboard-projects.component';

describe('PmDashboardProjectsComponent', () => {
    let component: PmDashboardProjectsComponent;
    let fixture: ComponentFixture<PmDashboardProjectsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardProjectsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardProjectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
