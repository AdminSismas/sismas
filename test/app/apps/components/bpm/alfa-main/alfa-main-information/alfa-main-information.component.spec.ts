import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlfaMainInformationComponent
} from '../../../../../../../src/app/apps/components/bpm/alfa-main/alfa-main-information/alfa-main-information.component';


describe(AlfaMainInformationComponent.name, () => {
  let component: AlfaMainInformationComponent;
  let fixture: ComponentFixture<AlfaMainInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlfaMainInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlfaMainInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
