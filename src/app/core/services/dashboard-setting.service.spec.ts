import {TestBed} from '@angular/core/testing';

import {DashboardSettingService} from './dashboard-setting.service';

describe('DashboardSettingService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DashboardSettingService = TestBed.get(DashboardSettingService);
        expect(service).toBeTruthy();
    });
});
