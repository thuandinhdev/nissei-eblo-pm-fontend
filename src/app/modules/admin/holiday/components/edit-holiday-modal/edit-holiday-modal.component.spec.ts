import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditHolidayModalComponent} from './edit-holiday-modal.component';

describe('EditHolidayModalComponent', () => {
    let component: EditHolidayModalComponent;
    let fixture: ComponentFixture<EditHolidayModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditHolidayModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditHolidayModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
