import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EntryDocumentsComponent
} from '../../../../../../../src/app/pages/pages/configuration/cadastralProcedures/entry-documents/entry-documents.component';

describe(EntryDocumentsComponent.name, () => {
  let component: EntryDocumentsComponent;
  let fixture: ComponentFixture<EntryDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
