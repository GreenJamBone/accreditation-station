import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreYouSureModalComponent } from './are-you-sure-modal.component';

describe('AreYouSureModalComponent', () => {
  let component: AreYouSureModalComponent;
  let fixture: ComponentFixture<AreYouSureModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreYouSureModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreYouSureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
