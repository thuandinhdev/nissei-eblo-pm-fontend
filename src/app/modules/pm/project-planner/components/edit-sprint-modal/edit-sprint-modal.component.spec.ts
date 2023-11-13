import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditSprintModalComponent} from './edit-sprint-modal.component';

describe('EditSprintModalComponent', () => {
    let component: EditSprintModalComponent;
    let fixture: ComponentFixture<EditSprintModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditSprintModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditSprintModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
