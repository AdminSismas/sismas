import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  GeodatabaseComponent
} from '@pages/open-data/downloads/geodatabase/geodatabase.component';

describe(GeodatabaseComponent.name, () => {
  let component: GeodatabaseComponent;
  let fixture: ComponentFixture<GeodatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeodatabaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeodatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
