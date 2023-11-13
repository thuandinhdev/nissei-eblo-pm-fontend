import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSeoComponent } from './create-seo.component';

describe('CreateSeoComponent', () => {
  let component: CreateSeoComponent;
  let fixture: ComponentFixture<CreateSeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
