import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CadastralInformationPropertyComponent
} from '../../../../../src/app/apps/components/information-property/cadastral-information-property/cadastral-information-property.component';
describe(CadastralInformationPropertyComponent.name, () => {
  let component: CadastralInformationPropertyComponent;
  let fixture: ComponentFixture<CadastralInformationPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastralInformationPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastralInformationPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
