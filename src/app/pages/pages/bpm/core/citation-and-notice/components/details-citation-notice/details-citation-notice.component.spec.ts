import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCitationNoticeComponent } from './details-citation-notice.component';

describe('DetailsCitationNoticeComponent', () => {
  let component: DetailsCitationNoticeComponent;
  let fixture: ComponentFixture<DetailsCitationNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCitationNoticeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsCitationNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
