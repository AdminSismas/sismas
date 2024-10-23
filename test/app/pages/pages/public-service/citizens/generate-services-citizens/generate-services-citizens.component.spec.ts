import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  GenerateServicesCitizensComponent
} from '../../../../../../../src/app/pages/pages/public-service/citizens/generate-services-citizens/generate-services-citizens.component';

describe(GenerateServicesCitizensComponent.name, () => {
  let component: GenerateServicesCitizensComponent;
  let fixture: ComponentFixture<GenerateServicesCitizensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateServicesCitizensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateServicesCitizensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
