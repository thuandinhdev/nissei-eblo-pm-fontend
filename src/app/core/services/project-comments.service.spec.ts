import {TestBed} from '@angular/core/testing';

import {ProjectCommentsService} from './project-comments.service';

describe('ProjectCommentsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ProjectCommentsService = TestBed.get(ProjectCommentsService);
        expect(service).toBeTruthy();
    });
});
