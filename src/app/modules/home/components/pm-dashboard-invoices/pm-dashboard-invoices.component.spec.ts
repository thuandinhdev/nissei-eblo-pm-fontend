import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PmDashboardInvoicesComponent} from './pm-dashboard-invoices.component';

describe('PmDashboardInvoicesComponent', () => {
    let component: PmDashboardInvoicesComponent;
    let fixture: ComponentFixture<PmDashboardInvoicesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PmDashboardInvoicesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PmDashboardInvoicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
