import {TestBed} from '@angular/core/testing';

import {LeavetypeService} from './leavetype.service';

describe('LeavetypeService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: LeavetypeService = TestBed.get(LeavetypeService);
        expect(service).toBeTruthy();
    });
});
