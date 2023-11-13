import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IncidentAttachmentComponent} from './incident-attachment.component';

describe('IncidentAttachmentComponent', () => {
    let component: IncidentAttachmentComponent;
    let fixture: ComponentFixture<IncidentAttachmentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IncidentAttachmentComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IncidentAttachmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
