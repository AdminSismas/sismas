import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CadastralSearchDAComponent
} from '../../../../../../src/app/pages/pages/open-data/cadastral-search-da/cadastral-search-da.component';
describe(CadastralSearchDAComponent.name, () => {
  let component: CadastralSearchDAComponent;
  let fixture: ComponentFixture<CadastralSearchDAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastralSearchDAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastralSearchDAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
