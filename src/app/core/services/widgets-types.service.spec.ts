import {TestBed} from '@angular/core/testing';

import {WidgetsTypesService} from './widgets-types.service';

describe('WidgetsTypesService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: WidgetsTypesService = TestBed.get(WidgetsTypesService);
        expect(service).toBeTruthy();
    });
});
