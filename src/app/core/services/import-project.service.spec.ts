import {TestBed} from '@angular/core/testing';

import {ImportProjectService} from './import-project.service';

describe('ImportProjectService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ImportProjectService = TestBed.get(ImportProjectService);
        expect(service).toBeTruthy();
    });
});
