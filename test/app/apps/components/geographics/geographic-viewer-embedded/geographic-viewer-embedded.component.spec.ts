import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  GeographicViewerEmbeddedComponent
} from '../../../../../../src/app/apps/components/geographics/geographic-viewer-embedded/geographic-viewer-embedded.component';


describe(GeographicViewerEmbeddedComponent.name, () => {
  let component: GeographicViewerEmbeddedComponent;
  let fixture: ComponentFixture<GeographicViewerEmbeddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeographicViewerEmbeddedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeographicViewerEmbeddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
