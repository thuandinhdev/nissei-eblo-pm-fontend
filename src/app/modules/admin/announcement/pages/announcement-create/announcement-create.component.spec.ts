import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AnnouncementCreateComponent} from './announcement-create.component';

describe('AnnouncementCreateComponent', () => {
    let component: AnnouncementCreateComponent;
    let fixture: ComponentFixture<AnnouncementCreateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AnnouncementCreateComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnnouncementCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
