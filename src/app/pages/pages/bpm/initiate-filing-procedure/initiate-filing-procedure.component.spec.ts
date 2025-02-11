import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateFilingProcedureComponent } from './initiate-filing-procedure.component';

describe('InitiateFilingProcedureComponent', () => {
  let component: InitiateFilingProcedureComponent;
  let fixture: ComponentFixture<InitiateFilingProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitiateFilingProcedureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitiateFilingProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
