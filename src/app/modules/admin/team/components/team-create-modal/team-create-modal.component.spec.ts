import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TeamCreateModalComponent} from './team-create-modal.component';

describe('TeamCreateModalComponent', () => {
    let component: TeamCreateModalComponent;
    let fixture: ComponentFixture<TeamCreateModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TeamCreateModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TeamCreateModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
