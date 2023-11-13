import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectCommentsComponent} from './project-comments.component';

describe('ProjectCommentsComponent', () => {
    let component: ProjectCommentsComponent;
    let fixture: ComponentFixture<ProjectCommentsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectCommentsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectCommentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
