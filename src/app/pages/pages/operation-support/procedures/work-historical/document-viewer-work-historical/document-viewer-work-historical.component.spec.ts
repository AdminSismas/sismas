import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewerWorkHistoricalComponent } from './document-viewer-work-historical.component';

describe('DocumentViewerWorkHistoricalComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
