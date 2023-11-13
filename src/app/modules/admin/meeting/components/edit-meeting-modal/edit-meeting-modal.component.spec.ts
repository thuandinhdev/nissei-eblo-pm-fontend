import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditMeetingModalComponent} from './edit-meeting-modal.component';

describe('EditMeetingModalComponent', () => {
    let component: EditMeetingModalComponent;
    let fixture: ComponentFixture<EditMeetingModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditMeetingModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditMeetingModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
