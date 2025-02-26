import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  HistoricalProceduresPropertyComponent
} from '../../../../../../src/app/apps/components/information-property/historical-procedures/historical-procedures.component';

describe(HistoricalProceduresPropertyComponent.name, () => {
  let component: HistoricalProceduresPropertyComponent;
  let fixture: ComponentFixture<HistoricalProceduresPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalProceduresPropertyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HistoricalProceduresPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
