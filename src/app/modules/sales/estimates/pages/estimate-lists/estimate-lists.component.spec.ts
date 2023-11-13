import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EstimateListsComponent} from './estimate-lists.component';

describe('EstimateListsComponent', () => {
    let component: EstimateListsComponent;
    let fixture: ComponentFixture<EstimateListsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EstimateListsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EstimateListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
