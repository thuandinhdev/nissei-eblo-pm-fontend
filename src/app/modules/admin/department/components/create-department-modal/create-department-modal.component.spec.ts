import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateDepartmentModalComponent} from './create-department-modal.component';

describe('CreateDepartmentModalComponent', () => {
    let component: CreateDepartmentModalComponent;
    let fixture: ComponentFixture<CreateDepartmentModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateDepartmentModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateDepartmentModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
