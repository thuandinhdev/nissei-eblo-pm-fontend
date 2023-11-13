import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserDefectsComponent} from './user-defects.component';

describe('UserDefectsComponent', () => {
    let component: UserDefectsComponent;
    let fixture: ComponentFixture<UserDefectsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserDefectsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserDefectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
