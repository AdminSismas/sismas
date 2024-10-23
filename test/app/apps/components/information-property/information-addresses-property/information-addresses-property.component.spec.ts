import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  InformationAddressesPropertyComponent
} from '../../../../../../src/app/apps/components/information-property/information-addresses-property/information-addresses-property.component';

describe(InformationAddressesPropertyComponent.name, () => {
  let component: InformationAddressesPropertyComponent;
  let fixture: ComponentFixture<InformationAddressesPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationAddressesPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationAddressesPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
