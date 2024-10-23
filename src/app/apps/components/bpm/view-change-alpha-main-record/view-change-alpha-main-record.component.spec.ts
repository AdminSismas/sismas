import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChangeAlphaMainRecordComponent } from './view-change-alpha-main-record.component';

describe('ViewChangeAlphaMainRecordComponent', () => {
  let component: ViewChangeAlphaMainRecordComponent;
  let fixture: ComponentFixture<ViewChangeAlphaMainRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewChangeAlphaMainRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewChangeAlphaMainRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
