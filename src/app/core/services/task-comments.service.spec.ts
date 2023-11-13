import {TestBed} from '@angular/core/testing';

import {TaskCommentsService} from './task-comments.service';

describe('TaskCommentsService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: TaskCommentsService = TestBed.get(TaskCommentsService);
        expect(service).toBeTruthy();
    });
});
