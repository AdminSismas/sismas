import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationAndNoticeComponent } from './citation-and-notice.component';

describe('CitationAndNoticeComponent', () => {
  let component: CitationAndNoticeComponent;
  let fixture: ComponentFixture<CitationAndNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitationAndNoticeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CitationAndNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
