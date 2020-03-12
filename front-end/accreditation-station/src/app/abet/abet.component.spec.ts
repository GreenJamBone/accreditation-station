import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbetComponent } from './abet.component';

describe('AbetComponent', () => {
  let component: AbetComponent;
  let fixture: ComponentFixture<AbetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
