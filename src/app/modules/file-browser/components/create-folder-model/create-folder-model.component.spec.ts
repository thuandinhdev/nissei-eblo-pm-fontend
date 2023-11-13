import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateFolderModelComponent} from './create-folder-model.component';

describe('CreateFolderModelComponent', () => {
    let component: CreateFolderModelComponent;
    let fixture: ComponentFixture<CreateFolderModelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateFolderModelComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateFolderModelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
