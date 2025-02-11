import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from '../../src/app/app.component';

describe(AppComponent.name, () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent]
    }).compileComponents();
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  test('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  test(`should have as title 'geoGestion'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(window.name).toEqual('geoGestion');
  });

});
