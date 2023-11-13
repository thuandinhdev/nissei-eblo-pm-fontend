import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditFolderModalComponent} from './edit-folder-modal.component';

describe('EditFolderModalComponent', () => {
    let component: EditFolderModalComponent;
    let fixture: ComponentFixture<EditFolderModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditFolderModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditFolderModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
