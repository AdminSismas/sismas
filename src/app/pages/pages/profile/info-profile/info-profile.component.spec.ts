import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoProfileComponent } from './info-profile.component';

describe('InfoProfileComponent', () => {
  let component: InfoProfileComponent;
  let fixture: ComponentFixture<InfoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
