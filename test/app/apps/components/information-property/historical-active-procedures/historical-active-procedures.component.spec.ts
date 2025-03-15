import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  HistoricalActiveProceduresPropertyComponent
} from '../../../../../../src/app/apps/components/information-property/historical-active-procedures/historical-procedures.component';

describe(HistoricalActiveProceduresPropertyComponent.name, () => {
  let component: HistoricalActiveProceduresPropertyComponent;
  let fixture: ComponentFixture<HistoricalActiveProceduresPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalActiveProceduresPropertyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HistoricalActiveProceduresPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
