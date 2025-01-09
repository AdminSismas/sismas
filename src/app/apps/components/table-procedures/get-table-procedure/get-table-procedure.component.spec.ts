import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTableProcedureComponent } from './get-table-procedure.component';

describe('GetTableProcedureComponent', () => {
  let component: GetTableProcedureComponent;
  let fixture: ComponentFixture<GetTableProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetTableProcedureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetTableProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
