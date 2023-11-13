import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateArticalModalComponent} from './create-artical-modal.component';

describe('CreateArticalModalComponent', () => {
    let component: CreateArticalModalComponent;
    let fixture: ComponentFixture<CreateArticalModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateArticalModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateArticalModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
