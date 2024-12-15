import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCitationNoticeComponent } from './crud-citation-notice.component';

describe('CrudCitationNoticeComponent', () => {
  let component: CrudCitationNoticeComponent;
  let fixture: ComponentFixture<CrudCitationNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudCitationNoticeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudCitationNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
