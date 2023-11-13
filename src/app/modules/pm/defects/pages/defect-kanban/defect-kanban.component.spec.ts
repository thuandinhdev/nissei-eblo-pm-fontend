import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DefectKanbanComponent} from './defect-kanban.component';

describe('DefectKanbanComponent', () => {
    let component: DefectKanbanComponent;
    let fixture: ComponentFixture<DefectKanbanComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefectKanbanComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefectKanbanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
