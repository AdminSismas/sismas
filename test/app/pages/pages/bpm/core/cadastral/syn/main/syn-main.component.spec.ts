import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SynMainComponent
} from '../../../../../../../../../src/app/pages/pages/bpm/core/cadastral/syn/main/syn-main.component';

describe(SynMainComponent.name, () => {
  let component: SynMainComponent;
  let fixture: ComponentFixture<SynMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
