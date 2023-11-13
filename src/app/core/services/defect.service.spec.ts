import {TestBed} from '@angular/core/testing';

import {DefectService} from './defect.service';

describe('DefectService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DefectService = TestBed.get(DefectService);
        expect(service).toBeTruthy();
    });
});
