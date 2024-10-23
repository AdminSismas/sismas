import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowErrorValidateAlfaMainComponent } from './show-error-validate-alfa-main.component';

describe('ShowErrorValidateAlfaMainComponent', () => {
  let component: ShowErrorValidateAlfaMainComponent;
  let fixture: ComponentFixture<ShowErrorValidateAlfaMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowErrorValidateAlfaMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowErrorValidateAlfaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
