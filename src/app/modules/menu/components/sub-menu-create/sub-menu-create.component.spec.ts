import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMenuCreateComponent } from './sub-menu-create.component';

describe('SubMenuCreateComponent', () => {
  let component: SubMenuCreateComponent;
  let fixture: ComponentFixture<SubMenuCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubMenuCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMenuCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
