import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TranslationsSettingsComponent} from './translations-settings.component';

describe('TranslationsSettingsComponent', () => {
    let component: TranslationsSettingsComponent;
    let fixture: ComponentFixture<TranslationsSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TranslationsSettingsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TranslationsSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
