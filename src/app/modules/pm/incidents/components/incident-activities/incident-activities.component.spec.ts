import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IncidentActivitiesComponent} from './incident-activities.component';

describe('IncidentActivitiesComponent', () => {
    let component: IncidentActivitiesComponent;
    let fixture: ComponentFixture<IncidentActivitiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IncidentActivitiesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IncidentActivitiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
