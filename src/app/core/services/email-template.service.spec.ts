import {TestBed} from '@angular/core/testing';

import {EmailTemplateService} from './email-template.service';

describe('EmailTemplateService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: EmailTemplateService = TestBed.get(EmailTemplateService);
        expect(service).toBeTruthy();
    });
});
