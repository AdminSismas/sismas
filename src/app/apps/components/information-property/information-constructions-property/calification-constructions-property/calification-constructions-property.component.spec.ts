import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificationConstructionsPropertyComponent } from './calification-constructions-property.component';

describe('CalificationConstructionsPropertyComponent', () => {
  let component: CalificationConstructionsPropertyComponent;
  let fixture: ComponentFixture<CalificationConstructionsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalificationConstructionsPropertyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalificationConstructionsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
