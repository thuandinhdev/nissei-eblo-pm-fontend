import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectPlannerDetailComponent} from './project-planner-detail.component';

describe('ProjectPlannerDetailComponent', () => {
    let component: ProjectPlannerDetailComponent;
    let fixture: ComponentFixture<ProjectPlannerDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectPlannerDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectPlannerDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
