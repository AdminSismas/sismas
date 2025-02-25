import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DocumentViewerWorkHistoricalComponent
} from '../../../../../../../../src/app/pages/pages/operation-support/procedures/work-historical/document-viewer-work-historical/document-viewer-work-historical.component';

describe(DocumentViewerWorkHistoricalComponent.name, () => {
  let component: DocumentViewerWorkHistoricalComponent;
  let fixture: ComponentFixture<DocumentViewerWorkHistoricalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentViewerWorkHistoricalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentViewerWorkHistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
