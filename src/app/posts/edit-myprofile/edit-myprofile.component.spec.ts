import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMyprofileComponent } from './edit-myprofile.component';

describe('EditMyprofileComponent', () => {
  let component: EditMyprofileComponent;
  let fixture: ComponentFixture<EditMyprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMyprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMyprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
