import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInformationConstructionDialogComponent } from './edit-information-construction-dialog.component';

describe('EditInformationConstructionDialogComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
