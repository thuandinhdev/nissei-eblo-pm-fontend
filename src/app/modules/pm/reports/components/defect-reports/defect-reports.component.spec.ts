import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DefectReportsComponent} from './defect-reports.component';

describe('DefectReportsComponent', () => {
    let component: DefectReportsComponent;
    let fixture: ComponentFixture<DefectReportsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefectReportsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefectReportsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
