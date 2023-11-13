import {TestBed} from '@angular/core/testing';

import {IncidentCommentService} from './incident-comment.service';

describe('IncidentCommentService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: IncidentCommentService = TestBed.get(IncidentCommentService);
        expect(service).toBeTruthy();
    });
});
