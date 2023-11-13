import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectTimesheetEditModalComponent} from './project-timesheet-edit-modal.component';

describe('ProjectTimesheetEditModalComponent', () => {
    let component: ProjectTimesheetEditModalComponent;
    let fixture: ComponentFixture<ProjectTimesheetEditModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectTimesheetEditModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectTimesheetEditModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
