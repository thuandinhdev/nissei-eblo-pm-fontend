import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IncidentKanbanComponent} from './incident-kanban.component';

describe('IncidentKanbanComponent', () => {
    let component: IncidentKanbanComponent;
    let fixture: ComponentFixture<IncidentKanbanComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IncidentKanbanComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IncidentKanbanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
