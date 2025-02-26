import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewChangeAlphaMainRecordComponent } from 'src/app/apps/components/bpm/view-change-alpha-main-record/view-change-alpha-main-record.component';

describe(ViewChangeAlphaMainRecordComponent.name, () => {
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

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
