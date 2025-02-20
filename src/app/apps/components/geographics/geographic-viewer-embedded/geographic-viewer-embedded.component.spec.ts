import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicViewerEmbeddedComponent } from './geographic-viewer-embedded.component';

describe('GeographicViewerEmbeddedComponent', () => {
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
