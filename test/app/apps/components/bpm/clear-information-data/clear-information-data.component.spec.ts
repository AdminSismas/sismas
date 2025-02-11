import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClearInformationDataComponent } from 'src/app/apps/components/bpm/clear-information-data/clear-information-data.component';


describe(ClearInformationDataComponent.name, () => {
  let component: ClearInformationDataComponent;
  let fixture: ComponentFixture<ClearInformationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClearInformationDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearInformationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
