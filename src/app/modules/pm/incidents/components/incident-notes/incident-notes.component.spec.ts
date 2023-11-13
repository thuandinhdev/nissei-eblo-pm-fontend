import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IncidentNotesComponent} from './incident-notes.component';

describe('IncidentNotesComponent', () => {
    let component: IncidentNotesComponent;
    let fixture: ComponentFixture<IncidentNotesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IncidentNotesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IncidentNotesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
