import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HeaderCadastralInformationPropertyComponent
} from '@features/property-management/components/shared/header-cadastral-information/header-cadastral-information-property.component';


describe(HeaderCadastralInformationPropertyComponent.name, () => {
  let component: HeaderCadastralInformationPropertyComponent;
  let fixture: ComponentFixture<HeaderCadastralInformationPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCadastralInformationPropertyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderCadastralInformationPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
