import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ResValidateComponent
} from '../../../../../../../../../src/app/pages/pages/bpm/core/cadastral/res/validate/res-validate.component';

describe(ResValidateComponent.name, () => {
  let component: ResValidateComponent;
  let fixture: ComponentFixture<ResValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResValidateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
