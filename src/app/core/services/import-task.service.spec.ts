import {TestBed} from '@angular/core/testing';

import {ImportTaskService} from './import-task.service';

describe('ImportTaskService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ImportTaskService = TestBed.get(ImportTaskService);
        expect(service).toBeTruthy();
    });
});
