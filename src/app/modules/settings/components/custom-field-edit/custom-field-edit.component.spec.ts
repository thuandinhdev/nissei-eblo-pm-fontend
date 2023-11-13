import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomFieldEditComponent} from './custom-field-edit.component';

describe('CustomFieldEditComponent', () => {
    let component: CustomFieldEditComponent;
    let fixture: ComponentFixture<CustomFieldEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CustomFieldEditComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomFieldEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
