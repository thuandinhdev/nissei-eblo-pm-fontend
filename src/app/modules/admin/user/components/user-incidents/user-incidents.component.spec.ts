import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserIncidentsComponent} from './user-incidents.component';

describe('UserIncidentsComponent', () => {
    let component: UserIncidentsComponent;
    let fixture: ComponentFixture<UserIncidentsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserIncidentsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserIncidentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
