import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CrudInformationAdjacentPropertyComponent
} from '../../../../../../../src/app/apps/components/information-property/information-adjacent-property/crud-information-adjacent-property/crud-information-adjacent-property.component';

describe(CrudInformationAdjacentPropertyComponent.name, () => {
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
