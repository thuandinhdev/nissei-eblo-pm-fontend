import {TestBed} from '@angular/core/testing';

import {DefectAttachmentService} from './defect-attachment.service';

describe('DefectAttachmentService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DefectAttachmentService = TestBed.get(DefectAttachmentService);
        expect(service).toBeTruthy();
    });
});
