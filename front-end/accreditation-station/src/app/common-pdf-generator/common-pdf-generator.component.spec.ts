import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPdfGeneratorComponent } from './common-pdf-generator.component';

describe('CommonPdfGeneratorComponent', () => {
  let component: CommonPdfGeneratorComponent;
  let fixture: ComponentFixture<CommonPdfGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPdfGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPdfGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
