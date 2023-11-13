import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EstimateSettingsComponent} from './estimate-settings.component';

describe('EstimateSettingsComponent', () => {
    let component: EstimateSettingsComponent;
    let fixture: ComponentFixture<EstimateSettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EstimateSettingsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EstimateSettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
