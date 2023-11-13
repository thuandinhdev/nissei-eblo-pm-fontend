import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateSprintTaskModalComponent} from './create-sprint-task-modal.component';

describe('CreateSprintTaskModalComponent', () => {
    let component: CreateSprintTaskModalComponent;
    let fixture: ComponentFixture<CreateSprintTaskModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateSprintTaskModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateSprintTaskModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
