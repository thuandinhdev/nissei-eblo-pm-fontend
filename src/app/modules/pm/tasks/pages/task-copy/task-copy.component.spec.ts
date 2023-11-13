import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskCopyComponent} from './task-copy.component';

describe('TaskCopyComponent', () => {
    let component: TaskCopyComponent;
    let fixture: ComponentFixture<TaskCopyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaskCopyComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskCopyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
