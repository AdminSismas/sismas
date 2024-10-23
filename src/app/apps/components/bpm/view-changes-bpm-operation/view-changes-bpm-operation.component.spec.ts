import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewChangesBpmOperationComponent } from './view-changes-bpm-operation.component';

describe('ViewChangesBpmOperationComponent', () => {
  let component: ViewChangesBpmOperationComponent;
  let fixture: ComponentFixture<ViewChangesBpmOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewChangesBpmOperationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewChangesBpmOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
