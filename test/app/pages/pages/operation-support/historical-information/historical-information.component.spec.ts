import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HistoricalInformationComponent
} from '../../../../../../src/app/pages/pages/operation-support/historical-information/historical-information.component';
describe(HistoricalInformationComponent.name, () => {
  let component: HistoricalInformationComponent;
  let fixture: ComponentFixture<HistoricalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
