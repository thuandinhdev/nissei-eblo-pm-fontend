import {TestBed} from '@angular/core/testing';

import {CustomFieldsService} from './custom-fields.service';

describe('CustomFieldsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: CustomFieldsService = TestBed.get(CustomFieldsService);
        expect(service).toBeTruthy();
    });
});
