import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  InformationPropertyOwnersComponent
} from '../../../../../../src/app/apps/components/information-property/information-property-owners/information-property-owners.component';

describe(InformationPropertyOwnersComponent.name, () => {
  let component: InformationPropertyOwnersComponent;
  let fixture: ComponentFixture<InformationPropertyOwnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationPropertyOwnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationPropertyOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
