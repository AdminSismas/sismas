import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteInformationZonesPropertyComponent } from 'src/app/apps/components/information-property/information-zones-property/delete-information-zones-property/delete-information-zones-property.component';

describe(DeleteInformationZonesPropertyComponent.name, () => {
  let component: DeleteInformationZonesPropertyComponent;
  let fixture: ComponentFixture<DeleteInformationZonesPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteInformationZonesPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteInformationZonesPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
