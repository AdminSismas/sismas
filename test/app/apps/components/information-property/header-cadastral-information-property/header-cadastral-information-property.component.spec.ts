import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HeaderCadastralInformationPropertyComponent
} from '../../../../../../src/app/apps/components/information-property/header-cadastral-information-property/header-cadastral-information-property.component';


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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
