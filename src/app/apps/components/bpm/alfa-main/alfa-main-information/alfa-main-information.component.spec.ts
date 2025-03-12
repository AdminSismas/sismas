import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlfaMainInformationComponent } from './alfa-main-information.component';

describe('AlfaMainInformationComponent', () => {
  let component: AlfaMainInformationComponent;
  let fixture: ComponentFixture<AlfaMainInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlfaMainInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlfaMainInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
