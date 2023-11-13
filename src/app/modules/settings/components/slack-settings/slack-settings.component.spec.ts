import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SlackSettingsComponent} from './slack-settings.component';

describe('SlackSettingsComponent', () => {
    let component: SlackSettingsComponent;
    let fixture: ComponentFixture<SlackSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SlackSettingsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlackSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
