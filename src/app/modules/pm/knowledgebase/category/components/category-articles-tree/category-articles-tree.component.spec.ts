import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CategoryArticlesTreeComponent} from './category-articles-tree.component';

describe('CategoryArticlesTreeComponent', () => {
    let component: CategoryArticlesTreeComponent;
    let fixture: ComponentFixture<CategoryArticlesTreeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CategoryArticlesTreeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CategoryArticlesTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
