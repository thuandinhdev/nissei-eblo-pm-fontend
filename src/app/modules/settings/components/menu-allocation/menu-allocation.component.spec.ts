import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuAllocationComponent} from './menu-allocation.component';

describe('MenuAllocationComponent', () => {
    let component: MenuAllocationComponent;
    let fixture: ComponentFixture<MenuAllocationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MenuAllocationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuAllocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
