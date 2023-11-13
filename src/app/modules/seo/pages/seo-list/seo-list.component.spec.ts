import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoListComponent } from './seo-list.component';

describe('SeoListComponent', () => {
  let component: SeoListComponent;
  let fixture: ComponentFixture<SeoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
