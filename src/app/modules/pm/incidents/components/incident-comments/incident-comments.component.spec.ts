import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IncidentCommentsComponent} from './incident-comments.component';

describe('IncidentCommentsComponent', () => {
    let component: IncidentCommentsComponent;
    let fixture: ComponentFixture<IncidentCommentsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IncidentCommentsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IncidentCommentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
