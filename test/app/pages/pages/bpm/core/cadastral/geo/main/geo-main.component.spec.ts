import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  GeoMainComponent
} from '../../../../../../../../../src/app/pages/pages/bpm/core/cadastral/geo/main/geo-main.component';

describe(GeoMainComponent.name, () => {
  let component: GeoMainComponent;
  let fixture: ComponentFixture<GeoMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
