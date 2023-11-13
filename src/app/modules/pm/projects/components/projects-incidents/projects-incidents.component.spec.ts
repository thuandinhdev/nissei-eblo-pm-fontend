import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectsIncidentsComponent} from './projects-incidents.component';

describe('ProjectsIncidentsComponent', () => {
    let component: ProjectsIncidentsComponent;
    let fixture: ComponentFixture<ProjectsIncidentsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectsIncidentsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectsIncidentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
