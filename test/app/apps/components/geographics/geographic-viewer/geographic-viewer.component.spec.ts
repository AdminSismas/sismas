import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  GeographicViewerComponent
} from '../../../../../../src/app/apps/components/geographics/geographic-viewer/geographic-viewer.component';


describe(GeographicViewerComponent.name, () => {
  let component: GeographicViewerComponent;
  let fixture: ComponentFixture<GeographicViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeographicViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeographicViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
