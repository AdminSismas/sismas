import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlfaMainComponent
} from '../../../../../../../../../src/app/pages/pages/bpm/core/cadastral/alf/main/alfa-main.component';


describe(AlfaMainComponent.name, () => {
  let component: AlfaMainComponent;
  let fixture: ComponentFixture<AlfaMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlfaMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlfaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
