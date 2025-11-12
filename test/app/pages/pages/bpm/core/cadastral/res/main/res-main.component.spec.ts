import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ResMainComponent
} from '@pages/bpm/core/cadastral/res/main/res-main.component';

describe(ResMainComponent.name, () => {
  let component: ResMainComponent;
  let fixture: ComponentFixture<ResMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
