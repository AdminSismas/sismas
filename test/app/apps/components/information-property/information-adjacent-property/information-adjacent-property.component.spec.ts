import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformationAdjacentPropertyComponent } from 'src/app/apps/components/information-property/information-adjacent-property/information-adjacent-property.component';



describe(InformationAdjacentPropertyComponent.name, () => {
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

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
