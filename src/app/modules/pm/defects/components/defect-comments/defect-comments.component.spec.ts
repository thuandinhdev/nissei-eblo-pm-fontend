import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DefectCommentsComponent} from './defect-comments.component';

describe('DefectCommentsComponent', () => {
    let component: DefectCommentsComponent;
    let fixture: ComponentFixture<DefectCommentsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefectCommentsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefectCommentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
