import {TestBed} from '@angular/core/testing';

import {IncidentAttachmentService} from './incident-attachment.service';

describe('IncidentAttachmentService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: IncidentAttachmentService = TestBed.get(IncidentAttachmentService);
        expect(service).toBeTruthy();
    });
});
