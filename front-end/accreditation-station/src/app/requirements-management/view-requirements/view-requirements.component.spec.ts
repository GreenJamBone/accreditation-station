import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequirementsComponent } from './view-requirements.component';

describe('ViewRequirementsComponent', () => {
  let component: ViewRequirementsComponent;
  let fixture: ComponentFixture<ViewRequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRequirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
