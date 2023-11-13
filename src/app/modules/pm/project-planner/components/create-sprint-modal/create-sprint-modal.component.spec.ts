import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateSprintModalComponent} from './create-sprint-modal.component';

describe('CreateSprintModalComponent', () => {
    let component: CreateSprintModalComponent;
    let fixture: ComponentFixture<CreateSprintModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateSprintModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateSprintModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
