import {TestBed} from '@angular/core/testing';

import {ProjectPlannerSprintService} from './project-planner-sprint.service';

describe('ProjectPlannerSprintService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ProjectPlannerSprintService = TestBed.get(ProjectPlannerSprintService);
        expect(service).toBeTruthy();
    });
});
