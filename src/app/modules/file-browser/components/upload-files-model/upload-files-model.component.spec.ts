import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadFilesModelComponent} from './upload-files-model.component';

describe('UploadFilesModelComponent', () => {
    let component: UploadFilesModelComponent;
    let fixture: ComponentFixture<UploadFilesModelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UploadFilesModelComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadFilesModelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
