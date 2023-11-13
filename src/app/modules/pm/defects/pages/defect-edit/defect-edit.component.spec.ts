import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DefectEditComponent} from './defect-edit.component';

describe('DefectEditComponent', () => {
    let component: DefectEditComponent;
    let fixture: ComponentFixture<DefectEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefectEditComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefectEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
