import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditSprintTaskModalComponent} from './edit-sprint-task-modal.component';

describe('EditSprintTaskModalComponent', () => {
    let component: EditSprintTaskModalComponent;
    let fixture: ComponentFixture<EditSprintTaskModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditSprintTaskModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditSprintTaskModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
