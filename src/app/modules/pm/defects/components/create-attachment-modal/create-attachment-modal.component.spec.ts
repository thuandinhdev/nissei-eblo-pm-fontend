import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateAttachmentModalComponent} from './create-attachment-modal.component';

describe('CreateAttachmentModalComponent', () => {
    let component: CreateAttachmentModalComponent;
    let fixture: ComponentFixture<CreateAttachmentModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateAttachmentModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateAttachmentModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
