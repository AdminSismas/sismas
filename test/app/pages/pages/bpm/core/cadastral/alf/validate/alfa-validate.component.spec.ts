import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlfaValidateComponent
} from '@pages/bpm/core/cadastral/alf/validate/alfa-validate.component';

describe(AlfaValidateComponent.name, () => {
  let component: AlfaValidateComponent;
  let fixture: ComponentFixture<AlfaValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlfaValidateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlfaValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
