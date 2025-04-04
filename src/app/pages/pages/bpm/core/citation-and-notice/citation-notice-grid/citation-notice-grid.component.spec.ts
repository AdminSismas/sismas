import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationNoticeGridComponent } from './citation-notice-grid.component';

describe('CitationNoticeGridComponent', () => {
  let component: CitationNoticeGridComponent;
  let fixture: ComponentFixture<CitationNoticeGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationNoticeGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CitationNoticeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
