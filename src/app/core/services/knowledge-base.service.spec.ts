import {TestBed} from '@angular/core/testing';

import {KnowledgeBaseService} from './knowledge-base.service';

describe('KnowledgeBaseService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: KnowledgeBaseService = TestBed.get(KnowledgeBaseService);
        expect(service).toBeTruthy();
    });
});
