import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ValidateAdministrativeActsComponent
} from '../../../../../../../src/app/pages/pages/public-service/citizens/validate-administrative-acts/validate-administrative-acts.component';

describe(ValidateAdministrativeActsComponent.name, () => {
  let component: ValidateAdministrativeActsComponent;
  let fixture: ComponentFixture<ValidateAdministrativeActsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateAdministrativeActsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateAdministrativeActsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
