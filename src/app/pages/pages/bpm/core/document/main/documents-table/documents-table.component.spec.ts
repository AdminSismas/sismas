import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsMainTableComponent } from './documents-table.component';

describe('DocumentsMainTableComponent', () => {
  let component: DocumentsMainTableComponent;
  let fixture: ComponentFixture<DocumentsMainTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsMainTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsMainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
