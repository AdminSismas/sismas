import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DocumentMainComponent
} from '../../../../../../../../src/app/pages/pages/bpm/core/document/main/document-main.component';

describe(DocumentMainComponent.name, () => {
  let component: DocumentMainComponent;
  let fixture: ComponentFixture<DocumentMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
