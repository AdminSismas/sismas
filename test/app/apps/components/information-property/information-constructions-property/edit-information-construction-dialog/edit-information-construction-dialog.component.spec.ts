import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditInformationConstructionDialogComponent } from 'src/app/apps/components/information-property/information-constructions-property/edit-information-construction-dialog/edit-information-construction-dialog.component';



describe(EditInformationConstructionDialogComponent.name, () => {
  let component: EditInformationConstructionDialogComponent;
  let fixture: ComponentFixture<EditInformationConstructionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInformationConstructionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInformationConstructionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
