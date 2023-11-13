import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LeaveTypeModalComponent} from './leave-type-modal.component';

describe('LeaveTypeModalComponent', () => {
    let component: LeaveTypeModalComponent;
    let fixture: ComponentFixture<LeaveTypeModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LeaveTypeModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeaveTypeModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
