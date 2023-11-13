import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomFieldCreateComponent} from './custom-field-create.component';

describe('CustomFieldCreateComponent', () => {
    let component: CustomFieldCreateComponent;
    let fixture: ComponentFixture<CustomFieldCreateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CustomFieldCreateComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomFieldCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
