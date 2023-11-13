import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DefectAttachmentComponent} from './defect-attachment.component';

describe('DefectAttachmentComponent', () => {
    let component: DefectAttachmentComponent;
    let fixture: ComponentFixture<DefectAttachmentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefectAttachmentComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefectAttachmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
