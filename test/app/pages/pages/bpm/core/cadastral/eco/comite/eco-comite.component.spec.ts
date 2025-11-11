import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EcoComiteComponent
} from '@pages/bpm/core/cadastral/eco/comite/eco-comite.component';

describe(EcoComiteComponent.name, () => {
  let component: EcoComiteComponent;
  let fixture: ComponentFixture<EcoComiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoComiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoComiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
