import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectDefectsComponent} from './project-defects.component';

describe('ProjectDefectsComponent', () => {
    let component: ProjectDefectsComponent;
    let fixture: ComponentFixture<ProjectDefectsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectDefectsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectDefectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
