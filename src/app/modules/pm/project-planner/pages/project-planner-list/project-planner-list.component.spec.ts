import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectPlannerListComponent} from './project-planner-list.component';

describe('ProjectPlannerListComponent', () => {
    let component: ProjectPlannerListComponent;
    let fixture: ComponentFixture<ProjectPlannerListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectPlannerListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectPlannerListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
