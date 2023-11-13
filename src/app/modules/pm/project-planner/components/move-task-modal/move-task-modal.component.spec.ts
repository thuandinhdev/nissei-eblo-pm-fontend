import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MoveTaskModalComponent} from './move-task-modal.component';

describe('MoveTaskModalComponent', () => {
    let component: MoveTaskModalComponent;
    let fixture: ComponentFixture<MoveTaskModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MoveTaskModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MoveTaskModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
