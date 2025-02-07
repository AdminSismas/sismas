import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationAdjacentPropertyComponent } from './information-adjacent-property.component';

describe('InformationAdjacentPropertyComponent', () => {
  let component: InformationAdjacentPropertyComponent;
  let fixture: ComponentFixture<InformationAdjacentPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationAdjacentPropertyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformationAdjacentPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
