import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCitationNoticeComponent } from './add-citation-notice.component';

describe('CrudCitationNoticeComponent', () => {
  let component: AddCitationNoticeComponent;
  let fixture: ComponentFixture<AddCitationNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCitationNoticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCitationNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
