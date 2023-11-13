import {TestBed} from '@angular/core/testing';

import {EstimateSettingService} from './estimate-setting.service';

describe('EstimateSettingService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: EstimateSettingService = TestBed.get(EstimateSettingService);
        expect(service).toBeTruthy();
    });
});
