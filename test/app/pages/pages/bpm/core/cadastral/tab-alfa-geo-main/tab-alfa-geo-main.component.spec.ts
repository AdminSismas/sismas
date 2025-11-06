import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabAlfaGeoMainComponent } from '@features/bpm-workflows/components/geo-main/tab-alfa-geo-main/tab-alfa-geo-main.component';

describe(TabAlfaGeoMainComponent.name, () => {
  let component: TabAlfaGeoMainComponent;
  let fixture: ComponentFixture<TabAlfaGeoMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabAlfaGeoMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabAlfaGeoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
