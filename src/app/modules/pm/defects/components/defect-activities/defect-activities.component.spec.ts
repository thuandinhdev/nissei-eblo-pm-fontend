import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DefectActivitiesComponent} from './defect-activities.component';

describe('DefectActivitiesComponent', () => {
    let component: DefectActivitiesComponent;
    let fixture: ComponentFixture<DefectActivitiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefectActivitiesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefectActivitiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
