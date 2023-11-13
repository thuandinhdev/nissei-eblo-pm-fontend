import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TaskImportModalComponent} from './task-import-modal.component';

describe('TaskImportModalComponent', () => {
    let component: TaskImportModalComponent;
    let fixture: ComponentFixture<TaskImportModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaskImportModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskImportModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
