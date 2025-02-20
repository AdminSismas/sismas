import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<<< HEAD:test/app/apps/components/geographic/geographic-viewer/geographic-viewer.component.spec.ts
import { GeographicViewerComponent } from 'src/app/apps/components/geographic/geographic-viewer/geographic-viewer.component';

========
import {
  GeographicViewerComponent
} from '../../../../../../src/app/apps/components/geographics/geographic-viewer/geographic-viewer.component';
>>>>>>>> db6d2e572ee7e64a9aa9fe99dc19d10b23eaca2e:test/app/apps/components/geographics/geographic-viewer/geographic-viewer.component.spec.ts


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
