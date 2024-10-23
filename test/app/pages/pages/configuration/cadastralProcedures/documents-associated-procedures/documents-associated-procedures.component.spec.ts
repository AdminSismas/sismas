import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DocumentsAssociatedProceduresComponent
} from '../../../../../../../src/app/pages/pages/configuration/cadastralProcedures/documents-associated-procedures/documents-associated-procedures.component';

describe(DocumentsAssociatedProceduresComponent.name, () => {
  let component: DocumentsAssociatedProceduresComponent;
  let fixture: ComponentFixture<DocumentsAssociatedProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsAssociatedProceduresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsAssociatedProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
