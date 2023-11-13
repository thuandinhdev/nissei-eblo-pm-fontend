import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardTodosComponent} from './pm-dashboard-todos.component';

describe('PmDashboardTodosComponent', () => {
    let component: PmDashboardTodosComponent;
    let fixture: ComponentFixture<PmDashboardTodosComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardTodosComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardTodosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
