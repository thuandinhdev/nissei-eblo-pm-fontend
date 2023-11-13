import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSeoComponent } from './edit-seo.component';

describe('EditSeoComponent', () => {
  let component: EditSeoComponent;
  let fixture: ComponentFixture<EditSeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
