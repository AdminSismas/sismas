import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DocumentValidateComponent
} from '../../../../../../../../src/app/pages/pages/bpm/core/document/validate/document-validate.component';

describe(DocumentValidateComponent.name, () => {
  let component: DocumentValidateComponent;
  let fixture: ComponentFixture<DocumentValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentValidateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DocumentValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
