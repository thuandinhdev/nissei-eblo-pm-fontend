import {TestBed} from '@angular/core/testing';

import {ItemgroupService} from './itemgroup.service';

describe('ItemgroupService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ItemgroupService = TestBed.get(ItemgroupService);
        expect(service).toBeTruthy();
    });
});
