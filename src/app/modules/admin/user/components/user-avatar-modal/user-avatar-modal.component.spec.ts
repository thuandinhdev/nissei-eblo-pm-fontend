import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserAvatarModalComponent} from './user-avatar-modal.component';

describe('UserAvatarModalComponent', () => {
    let component: UserAvatarModalComponent;
    let fixture: ComponentFixture<UserAvatarModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserAvatarModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserAvatarModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
