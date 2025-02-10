import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalProceduresComponent } from './historical-procedures.component';

describe('HistoricalProceduresComponent', () => {
  let component: HistoricalProceduresComponent;
  let fixture: ComponentFixture<HistoricalProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalProceduresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoricalProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
