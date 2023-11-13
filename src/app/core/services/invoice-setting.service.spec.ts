import {TestBed} from '@angular/core/testing';

import {InvoiceSettingService} from './invoice-setting.service';

describe('InvoiceSettingService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: InvoiceSettingService = TestBed.get(InvoiceSettingService);
        expect(service).toBeTruthy();
    });
});
