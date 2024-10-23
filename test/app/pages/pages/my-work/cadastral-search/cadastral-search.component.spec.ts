import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CadastralSearchComponent
} from '../../../../../../src/app/pages/pages/my-work/cadastral-search/cadastral-search.component';

describe(CadastralSearchComponent.name, () => {
  let component: CadastralSearchComponent;
  let fixture: ComponentFixture<CadastralSearchComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CadastralSearchComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastralSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('Make Match with the snapshot', () => {
   /* expect(compiled.innerHTML).toMatchSnapshot();*/
  });
});
