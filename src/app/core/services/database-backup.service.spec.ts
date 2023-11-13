import {TestBed} from '@angular/core/testing';

import {DatabaseBackupService} from './database-backup.service';

describe('DatabaseBackupService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DatabaseBackupService = TestBed.get(DatabaseBackupService);
        expect(service).toBeTruthy();
    });
});
