import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from '../../../../../../src/app/apps/components/information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';

describe(LayoutCardCadastralInformationPropertyComponentComponent.name, () => {
  let component: LayoutCardCadastralInformationPropertyComponentComponent;
  let fixture: ComponentFixture<LayoutCardCadastralInformationPropertyComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutCardCadastralInformationPropertyComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutCardCadastralInformationPropertyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
