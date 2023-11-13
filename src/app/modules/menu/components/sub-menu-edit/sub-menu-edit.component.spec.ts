import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMenuEditComponent } from './sub-menu-edit.component';

describe('SubMenuEditComponent', () => {
  let component: SubMenuEditComponent;
  let fixture: ComponentFixture<SubMenuEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubMenuEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMenuEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
