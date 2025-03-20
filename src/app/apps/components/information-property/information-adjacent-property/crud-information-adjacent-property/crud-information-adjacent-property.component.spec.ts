import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudInformationAdjacentPropertyComponent } from './crud-information-adjacent-property.component';

describe('CrudInformationAdjacentPropertyComponent', () => {
  let component: CrudInformationAdjacentPropertyComponent;
  let fixture: ComponentFixture<CrudInformationAdjacentPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudInformationAdjacentPropertyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudInformationAdjacentPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
