import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewChangesBpmOperationComponent } from '@features/bpm-workflows/components/view-changes-bpm-operation/view-changes-bpm-operation.component';


describe(ViewChangesBpmOperationComponent.name, () => {
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

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
