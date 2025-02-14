import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HeaderBpmCoreComponent
} from '../../../../../../src/app/apps/components/bpm/header-bpm-core/header-bpm-core.component';

describe(HeaderBpmCoreComponent.name, () => {
  let component: HeaderBpmCoreComponent;
  let fixture: ComponentFixture<HeaderBpmCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBpmCoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBpmCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
