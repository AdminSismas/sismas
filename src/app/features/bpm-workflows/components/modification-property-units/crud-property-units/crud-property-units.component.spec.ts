import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudPropertyUnitsComponent } from './crud-property-units.component';

describe('CrudPropertyUnitsComponent', () => {
  let component: CrudPropertyUnitsComponent;
  let fixture: ComponentFixture<CrudPropertyUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudPropertyUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudPropertyUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
