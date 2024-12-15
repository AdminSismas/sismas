import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationNoticeCardComponent } from './citation-notice-card.component';

describe('CitationNoticeCardComponent', () => {
  let component: CitationNoticeCardComponent;
  let fixture: ComponentFixture<CitationNoticeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationNoticeCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CitationNoticeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
