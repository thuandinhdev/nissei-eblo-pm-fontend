import {TestBed} from '@angular/core/testing';

import {DefectCommentsService} from './defect-comments.service';

describe('DefectCommentsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DefectCommentsService = TestBed.get(DefectCommentsService);
        expect(service).toBeTruthy();
    });
});
