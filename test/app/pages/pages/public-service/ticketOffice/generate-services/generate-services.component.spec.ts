import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  GenerateServicesComponent
} from '../../../../../../../src/app/pages/pages/public-service/ticketOffice/generate-services/generate-services.component';

describe(GenerateServicesComponent.name, () => {
  let component: GenerateServicesComponent;
  let fixture: ComponentFixture<GenerateServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
