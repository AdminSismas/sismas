import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  VisitaComponent
} from '../../../../../../../../src/app/pages/pages/bpm/core/cadastral/visita/visita.component';

describe(VisitaComponent.name, () => {
  let component: VisitaComponent;
  let fixture: ComponentFixture<VisitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
