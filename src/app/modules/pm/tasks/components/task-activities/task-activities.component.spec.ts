import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskActivitiesComponent} from './task-activities.component';

describe('TaskActivitiesComponent', () => {
    let component: TaskActivitiesComponent;
    let fixture: ComponentFixture<TaskActivitiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaskActivitiesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskActivitiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
