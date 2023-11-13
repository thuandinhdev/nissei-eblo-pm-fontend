import {TestBed} from '@angular/core/testing';

import {WebMenuService} from './web-menu.service';

describe('WebMenuService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: WebMenuService = TestBed.get(WebMenuService);
        expect(service).toBeTruthy();
    });
});
