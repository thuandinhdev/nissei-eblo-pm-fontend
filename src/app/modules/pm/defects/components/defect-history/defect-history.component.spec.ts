import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DefectHistoryComponent} from './defect-history.component';

describe('DefectHistoryComponent', () => {
    let component: DefectHistoryComponent;
    let fixture: ComponentFixture<DefectHistoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefectHistoryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefectHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
